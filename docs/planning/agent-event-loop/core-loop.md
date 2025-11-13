# Core Event Loop Pattern

**The fundamental agent event loop that powers all implementations**

---

## The Universal Pattern

Every agent implementation (CLI, Telegram, HTTP API) follows this exact pattern:

```
LOOP:
  1. Wait for user input
  2. Initialize agent client (or reuse existing)
  3. Send query to agent
  4. Stream response blocks
  5. Process each block type
  6. Capture session for persistence
  7. Return to step 1
```

---

## Detailed Flow

### Phase 1: Initialization (Once per session or request)

```
IF session_id exists:
  options.resume = session_id
END IF

client = CREATE AgentClient(options)
```

**Key Decision**: Resume existing session or start new?

### Phase 2: Query Submission

```
AWAIT client.query(user_message)
```

**Non-blocking**: This doesn't wait for response, it initiates the agent loop.

### Phase 3: Response Streaming (The Core Loop)

```
FOR EACH message IN client.receive_response():
  
  MATCH message.type:
    
    CASE "AssistantMessage":
      FOR EACH block IN message.content:
        
        MATCH block.type:
          
          CASE "TextBlock":
            text = block.text
            EMIT text to user interface
            BUFFER text for complete response
          
          CASE "ToolUseBlock":
            tool_name = block.name
            tool_input = block.input
            LOG "Tool executing: {tool_name}"
            # Tool executes automatically by SDK
            # No action needed here
          
          CASE "ToolResultBlock":
            tool_result = block.content
            LOG "Tool result received"
            # SDK handles this automatically
        
        END MATCH
      END FOR
    
    CASE "ResultMessage":
      session_id = message.session_id
      usage = message.usage
      cost = message.total_cost_usd
      duration = message.duration_ms
      turns = message.num_turns
      
      SAVE session_id to persistence layer
      LOG metrics (usage, cost, duration, turns)
      
      BREAK streaming loop
  
  END MATCH

END FOR
```

### Phase 4: Cleanup/Persistence

```
IF session_id:
  SAVE session_id to storage(user_id, session_id)
END IF

RETURN complete_response to user
```

---

## Streaming vs Non-Streaming

### Streaming Mode (Real-time Updates)

```
FOR EACH message IN client.receive_response():
  IF message is AssistantMessage:
    FOR EACH block IN message.content:
      IF block is TextBlock:
        IMMEDIATELY emit block.text to user
        # User sees response as it's generated
```

**Use when**: Real-time chat, interactive applications, better UX

### Non-Streaming Mode (Wait for Complete Response)

```
messages = []

FOR EACH message IN client.receive_response():
  APPEND message to messages
END FOR

complete_text = EXTRACT_ALL_TEXT(messages)
RETURN complete_text to user
```

**Use when**: API responses, batch processing, simpler implementation

---

## Message Flow Diagram

```
User Input
    ↓
┌─────────────────────────────────────┐
│  client.query(user_message)         │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│  FOR EACH message IN stream:        │
│                                     │
│  ┌─ AssistantMessage                │
│  │   ├─ TextBlock → Display         │
│  │   ├─ ToolUseBlock → Log          │
│  │   └─ ToolResultBlock → Log       │
│  │                                  │
│  └─ ResultMessage                   │
│      ├─ session_id → Save           │
│      ├─ usage → Track               │
│      ├─ cost → Track                │
│      └─ BREAK loop                  │
│                                     │
└────────────┬────────────────────────┘
             ↓
      Return Response
```

---

## Multi-Turn Conversation Pattern

### Turn 1: Initial Query

```
options = {
  cwd: "/workspace",
  system_prompt: "You are a helpful assistant",
  allowed_tools: ["Read", "Write"]
  # No resume parameter - new session
}

client = CREATE AgentClient(options)
AWAIT client.query("Read README.md")

FOR EACH message IN client.receive_response():
  # Process response
  IF message is ResultMessage:
    session_id = message.session_id  # Save this!
  END IF
END FOR

CLOSE client
```

### Turn 2: Follow-up Query (Same Session)

```
options = {
  cwd: "/workspace",
  system_prompt: "You are a helpful assistant",
  allowed_tools: ["Read", "Write"],
  resume: session_id  # ← Resume previous conversation
}

client = CREATE AgentClient(options)
AWAIT client.query("Now summarize it")

FOR EACH message IN client.receive_response():
  # Agent remembers the README content from Turn 1
  # It can summarize without re-reading
END FOR

CLOSE client
```

**Key**: Session persistence enables context across turns

---

## Tool Execution Flow

```
User: "Read file.txt and count the lines"
    ↓
Agent decides: "I need to use Read tool"
    ↓
ToolUseBlock emitted
  - name: "Read"
  - input: { file_path: "file.txt" }
    ↓
SDK executes tool automatically
    ↓
Tool returns result
    ↓
ToolResultBlock emitted
  - content: "Line 1\nLine 2\nLine 3"
    ↓
Agent processes result
    ↓
TextBlock emitted
  - text: "The file has 3 lines"
    ↓
ResultMessage emitted
  - session_id, usage, etc.
```

**Important**: You don't call tools manually. SDK does it automatically.

---

## Error Scenarios

### Scenario 1: Authentication Error

```
TRY:
  client = CREATE AgentClient(options)
CATCH AuthenticationError:
  RETURN "Please run 'claude auth login' first"
END TRY
```

**Happens**: Before event loop starts (initialization layer)

### Scenario 2: Tool Execution Error

```
FOR EACH message IN client.receive_response():
  IF message is AssistantMessage:
    FOR EACH block IN message.content:
      IF block is ToolUseBlock:
        TRY:
          # SDK executes tool
        CATCH ToolError as error:
          LOG "Tool {block.name} failed: {error}"
          # SDK handles error, agent may retry or report to user
        END TRY
      END IF
    END FOR
  END IF
END FOR
```

**Happens**: During event loop (SDK manages gracefully)

### Scenario 3: Network/API Error

```
TRY:
  FOR EACH message IN client.receive_response():
    # Process messages
  END FOR
CATCH NetworkError:
  RETURN "Connection lost. Please try again."
CATCH APIError as error:
  IF error.status == 429:
    RETURN "Rate limit exceeded. Please wait."
  ELSE IF error.status == 500:
    RETURN "API error. Please try again later."
  END IF
END TRY
```

**Happens**: During streaming (network issues)

---

## Session Management Patterns

### Pattern 1: In-Memory (Single User)

```
global current_session_id = null

FUNCTION handle_query(user_message):
  options = BASE_OPTIONS
  
  IF current_session_id:
    options.resume = current_session_id
  END IF
  
  client = CREATE AgentClient(options)
  AWAIT client.query(user_message)
  
  FOR EACH message IN client.receive_response():
    IF message is ResultMessage:
      current_session_id = message.session_id
    END IF
  END FOR
END FUNCTION
```

**Use case**: Simple CLI, single-user apps

### Pattern 2: File-Based (Multi-User)

```
FUNCTION get_session_id(user_id):
  file = "sessions/{user_id}.json"
  IF file exists:
    data = READ_JSON(file)
    RETURN data.session_id
  ELSE:
    RETURN null
  END IF
END FUNCTION

FUNCTION save_session_id(user_id, session_id):
  file = "sessions/{user_id}.json"
  WRITE_JSON(file, {
    session_id: session_id,
    updated_at: CURRENT_TIMESTAMP()
  })
END FUNCTION

FUNCTION handle_query(user_id, user_message):
  session_id = get_session_id(user_id)
  
  options = BASE_OPTIONS
  IF session_id:
    options.resume = session_id
  END IF
  
  client = CREATE AgentClient(options)
  # ... process response ...
  
  save_session_id(user_id, new_session_id)
END FUNCTION
```

**Use case**: Telegram bots, multi-user HTTP APIs

### Pattern 3: Database (Production)

```
FUNCTION handle_query(user_id, user_message):
  session = DATABASE.query(
    "SELECT session_id FROM agent_sessions WHERE user_id = ?",
    [user_id]
  )
  
  options = BASE_OPTIONS
  IF session:
    options.resume = session.session_id
  END IF
  
  client = CREATE AgentClient(options)
  # ... process response ...
  
  DATABASE.upsert("agent_sessions", {
    user_id: user_id,
    session_id: new_session_id,
    updated_at: CURRENT_TIMESTAMP()
  })
END FUNCTION
```

**Use case**: Production applications with many users

---

## Performance Considerations

### Client Reuse (Performance Optimization)

**Inefficient (Create client per request):**
```
FOR EACH request:
  client = CREATE AgentClient(options)  # Expensive!
  AWAIT client.query(message)
  # Process response
  CLOSE client
END FOR
```

**Efficient (Reuse client when possible):**
```
client = CREATE AgentClient(options)  # Once

FOR EACH request:
  AWAIT client.query(message)  # Reuse client
  # Process response
END FOR

CLOSE client  # When done
```

**Note**: Only works for same-session requests

### Streaming Performance

**Block-level streaming (What SDK provides):**
- Complete text blocks arrive
- ~100-500ms per block
- Good for UI updates

**Token-level streaming (NOT available in SDK):**
- Individual tokens arrive
- ~10-50ms per token
- Better UX but not supported

**Tradeoff**: Accept block-level for simplicity

---

## Summary: What You Must Implement

### Mandatory
1. ✅ Client initialization with options
2. ✅ Send query to client
3. ✅ Loop through streaming responses
4. ✅ Detect message types (Assistant vs Result)
5. ✅ Detect block types (Text vs Tool)
6. ✅ Capture and save session_id

### Optional
7. Session persistence (file/database)
8. Token/cost tracking
9. Error handling
10. Logging/monitoring
11. Multi-user isolation

### Provided by SDK
- Agent reasoning
- Tool execution
- Response streaming
- Session ID generation
- Token counting
- Cost calculation

---

**Next**: Read 02-initialization.md for client setup details
