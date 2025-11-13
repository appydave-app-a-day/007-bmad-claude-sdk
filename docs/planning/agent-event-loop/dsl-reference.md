# Human-Readable DSL for Agent Event Loop

**A language-agnostic specification that translates to any programming language**

---

## Purpose

This DSL (Domain-Specific Language) describes the Agent Event Loop in human-readable form that can be:
1. Understood by humans
2. Translated by AI to any language
3. Used as complete implementation spec

---

## Complete Agent Event Loop Specification

### 1. INITIALIZATION

```dsl
DEFINE AgentOptions AS:
  working_directory: path_string
  system_prompt: text
  allowed_tools: list_of_tool_names
  mcp_servers: map_of_server_configs (optional)
  resume_session_id: string (optional)
END DEFINE

FUNCTION initialize_agent(user_id, user_message):
  
  # Load previous session if exists
  session_id = LOAD_SESSION(user_id)
  
  # Configure agent
  options = CREATE AgentOptions WITH:
    working_directory = get_user_workspace(user_id)
    system_prompt = "You are a helpful assistant"
    allowed_tools = ["Read", "Write", "Bash", "Edit"]
    mcp_servers = {
      "sequential-thinking": {
        command: "npx",
        args: ["-y", "@modelcontextprotocol/server-sequential-thinking"]
      }
    }
    resume_session_id = session_id IF session_id EXISTS
  END WITH
  
  # Create client
  client = CREATE AgentClient(options)
  
  RETURN client
END FUNCTION
```

**Translates to JavaScript:**
```javascript
async function initializeAgent(userId, userMessage) {
  const sessionId = await loadSession(userId);
  
  const options = {
    cwd: getUserWorkspace(userId),
    systemPrompt: "You are a helpful assistant",
    allowedTools: ["Read", "Write", "Bash", "Edit"],
    mcpServers: {
      "sequential-thinking": {
        command: "npx",
        args: ["-y", "@modelcontextprotocol/server-sequential-thinking"]
      }
    },
    ...(sessionId && { resume: sessionId })
  };
  
  const client = new ClaudeSDKClient(options);
  return client;
}
```

### 2. QUERY SUBMISSION

```dsl
FUNCTION send_query(client, message):
  AWAIT client.query(message)
  # This is non-blocking - response comes via streaming
END FUNCTION
```

**Translates to JavaScript:**
```javascript
async function sendQuery(client, message) {
  await client.query(message);
  // Non-blocking - stream response separately
}
```

### 3. RESPONSE STREAMING (The Core Loop)

```dsl
FUNCTION process_streaming_response(client, output_handler):
  
  # Initialize collectors
  full_text_response = ""
  tools_used = []
  new_session_id = null
  metrics = null
  
  # Stream response blocks
  FOR EACH message IN AWAIT client.receive_response():
    
    IF message IS AssistantMessage:
      
      FOR EACH block IN message.content:
        
        IF block IS TextBlock:
          text_chunk = block.text
          full_text_response = full_text_response + text_chunk
          
          # Emit to user interface immediately (streaming)
          output_handler.emit_text(text_chunk)
        
        ELSE IF block IS ToolUseBlock:
          tool_info = {
            name: block.name,
            input: block.input,
            id: block.id
          }
          tools_used.append(tool_info)
          
          # Log tool execution
          output_handler.emit_tool_use(block.name)
          
          # Tool executes automatically - no action needed
        
        ELSE IF block IS ToolResultBlock:
          # Tool result received
          # SDK handles this internally
          # Optionally log for debugging
          output_handler.log_tool_result(block.tool_use_id)
        
        END IF
      END FOR
    
    ELSE IF message IS ResultMessage:
      # Conversation turn complete
      
      new_session_id = message.session_id
      
      metrics = {
        input_tokens: message.usage.input_tokens,
        output_tokens: message.usage.output_tokens,
        cache_read_tokens: message.usage.cache_read_input_tokens,
        cache_creation_tokens: message.usage.cache_creation_input_tokens,
        total_cost_usd: message.total_cost_usd,
        duration_ms: message.duration_ms,
        api_duration_ms: message.duration_api_ms,
        num_turns: message.num_turns
      }
      
      # Exit streaming loop
      BREAK
    
    END IF
  
  END FOR
  
  RETURN {
    text: full_text_response,
    tools: tools_used,
    session_id: new_session_id,
    metrics: metrics
  }
END FUNCTION
```

**Translates to JavaScript:**
```javascript
async function processStreamingResponse(client, outputHandler) {
  let fullTextResponse = "";
  const toolsUsed = [];
  let newSessionId = null;
  let metrics = null;
  
  for await (const message of client.receiveResponse()) {
    if (message.type === 'assistant') {
      for (const block of message.content) {
        if (block.type === 'text') {
          const textChunk = block.text;
          fullTextResponse += textChunk;
          outputHandler.emitText(textChunk);
        }
        else if (block.type === 'tool_use') {
          const toolInfo = {
            name: block.name,
            input: block.input,
            id: block.id
          };
          toolsUsed.push(toolInfo);
          outputHandler.emitToolUse(block.name);
        }
        else if (block.type === 'tool_result') {
          outputHandler.logToolResult(block.tool_use_id);
        }
      }
    }
    else if (message.type === 'result') {
      newSessionId = message.session_id;
      metrics = {
        inputTokens: message.usage.input_tokens,
        outputTokens: message.usage.output_tokens,
        cacheReadTokens: message.usage.cache_read_input_tokens,
        cacheCreationTokens: message.usage.cache_creation_input_tokens,
        totalCostUsd: message.total_cost_usd,
        durationMs: message.duration_ms,
        apiDurationMs: message.duration_api_ms,
        numTurns: message.num_turns
      };
      break;
    }
  }
  
  return {
    text: fullTextResponse,
    tools: toolsUsed,
    sessionId: newSessionId,
    metrics
  };
}
```

### 4. SESSION PERSISTENCE

```dsl
FUNCTION save_session(user_id, session_id):
  session_file = "sessions/" + user_id + ".json"
  
  data = {
    session_id: session_id,
    updated_at: CURRENT_TIMESTAMP(),
    user_id: user_id
  }
  
  WRITE_JSON_FILE(session_file, data)
END FUNCTION

FUNCTION load_session(user_id):
  session_file = "sessions/" + user_id + ".json"
  
  IF FILE_EXISTS(session_file):
    data = READ_JSON_FILE(session_file)
    RETURN data.session_id
  ELSE:
    RETURN null
  END IF
END FUNCTION

FUNCTION clear_session(user_id):
  session_file = "sessions/" + user_id + ".json"
  DELETE_FILE(session_file)
END FUNCTION
```

**Translates to JavaScript:**
```javascript
async function saveSession(userId, sessionId) {
  const sessionFile = `sessions/${userId}.json`;
  const data = {
    session_id: sessionId,
    updated_at: new Date().toISOString(),
    user_id: userId
  };
  await fs.writeFile(sessionFile, JSON.stringify(data, null, 2));
}

async function loadSession(userId) {
  const sessionFile = `sessions/${userId}.json`;
  try {
    const data = JSON.parse(await fs.readFile(sessionFile, 'utf8'));
    return data.session_id;
  } catch (error) {
    return null;
  }
}

async function clearSession(userId) {
  const sessionFile = `sessions/${userId}.json`;
  await fs.unlink(sessionFile).catch(() => {});
}
```

### 5. COMPLETE FLOW (Putting It All Together)

```dsl
FUNCTION handle_user_message(user_id, user_message):
  
  # Step 1: Initialize
  client = initialize_agent(user_id, user_message)
  
  # Step 2: Send query
  AWAIT send_query(client, user_message)
  
  # Step 3: Stream response
  output_handler = CREATE OutputHandler()
  result = AWAIT process_streaming_response(client, output_handler)
  
  # Step 4: Save session
  IF result.session_id:
    save_session(user_id, result.session_id)
  END IF
  
  # Step 5: Log metrics (optional)
  IF result.metrics:
    log_metrics(user_id, result.metrics, result.tools)
  END IF
  
  # Step 6: Close client
  AWAIT client.close()
  
  RETURN result.text
END FUNCTION
```

**Translates to JavaScript:**
```javascript
async function handleUserMessage(userId, userMessage) {
  // Step 1: Initialize
  const client = await initializeAgent(userId, userMessage);
  
  // Step 2: Send query
  await sendQuery(client, userMessage);
  
  // Step 3: Stream response
  const outputHandler = new OutputHandler();
  const result = await processStreamingResponse(client, outputHandler);
  
  // Step 4: Save session
  if (result.sessionId) {
    await saveSession(userId, result.sessionId);
  }
  
  // Step 5: Log metrics (optional)
  if (result.metrics) {
    logMetrics(userId, result.metrics, result.tools);
  }
  
  // Step 6: Close client
  await client.close();
  
  return result.text;
}
```

---

## Conditional Flows

### IF: Continuing Conversation vs New Conversation

```dsl
FUNCTION determine_conversation_mode(messages_array):
  user_message_count = COUNT messages WHERE role = "user"
  
  IF user_message_count > 1:
    RETURN "continuing"  # Load session
  ELSE:
    RETURN "new"  # Don't load session
  END IF
END FUNCTION
```

### IF: Streaming vs Non-Streaming

```dsl
FUNCTION handle_response(client, streaming_enabled):
  
  IF streaming_enabled:
    # Real-time updates
    FOR EACH message IN AWAIT client.receive_response():
      IF message IS AssistantMessage:
        FOR EACH block IN message.content:
          IF block IS TextBlock:
            IMMEDIATELY_SEND_TO_USER(block.text)
          END IF
        END FOR
      END IF
    END FOR
  
  ELSE:
    # Wait for complete response
    messages = []
    FOR EACH message IN AWAIT client.receive_response():
      messages.append(message)
    END FOR
    
    complete_text = EXTRACT_ALL_TEXT(messages)
    SEND_TO_USER(complete_text)
  
  END IF
END FUNCTION
```

### IF: Error Handling

```dsl
FUNCTION safe_handle_message(user_id, user_message):
  
  TRY:
    result = handle_user_message(user_id, user_message)
    RETURN SUCCESS(result)
  
  CATCH AuthenticationError AS error:
    RETURN ERROR("Please run 'claude auth login' first")
  
  CATCH ToolExecutionError AS error:
    RETURN ERROR("Tool execution failed: " + error.message)
  
  CATCH NetworkError AS error:
    RETURN ERROR("Network error. Please try again.")
  
  CATCH RateLimitError AS error:
    RETURN ERROR("Rate limit exceeded. Please wait and try again.")
  
  CATCH ANY_ERROR AS error:
    LOG_ERROR(error)
    RETURN ERROR("An unexpected error occurred")
  
  END TRY
END FUNCTION
```

---

## Custom Tools Integration

```dsl
FUNCTION create_custom_tool(name, description, input_schema, handler):
  RETURN {
    name: name,
    description: description,
    input_schema: input_schema,
    execute: handler
  }
END FUNCTION

# Example: Custom tool for your self-editing app
read_json_tool = create_custom_tool(
  name: "read_json",
  description: "Read a JSON file from the data directory",
  input_schema: {
    type: "object",
    properties: {
      filepath: {
        type: "string",
        description: "Path to JSON file relative to data/"
      }
    },
    required: ["filepath"]
  },
  handler: FUNCTION(input):
    safe_path = VALIDATE_PATH(input.filepath, "data/")
    IF NOT safe_path:
      THROW ERROR("Invalid path: must be within data/")
    END IF
    content = READ_JSON_FILE(safe_path)
    RETURN content
  END FUNCTION
)

# Register tools with agent
options.allowed_tools = [read_json_tool, write_json_tool, write_file_tool]
```

**Translates to JavaScript:**
```javascript
function createCustomTool(name, description, inputSchema, handler) {
  return { name, description, input_schema: inputSchema, execute: handler };
}

const readJsonTool = createCustomTool(
  "read_json",
  "Read a JSON file from the data directory",
  {
    type: "object",
    properties: {
      filepath: {
        type: "string",
        description: "Path to JSON file relative to data/"
      }
    },
    required: ["filepath"]
  },
  (input) => {
    const safePath = validatePath(input.filepath, "data/");
    if (!safePath) {
      throw new Error("Invalid path: must be within data/");
    }
    return JSON.parse(fs.readFileSync(safePath, 'utf8'));
  }
);

options.allowedTools = [readJsonTool, writeJsonTool, writeFileTool];
```

---

## BMAD Quality Gate Hook

```dsl
FUNCTION create_bmad_quality_gate():
  RETURN {
    before_tool_call: FUNCTION(context):
      IF context.tool_name IN ["write_json", "write_file"]:
        active_story = "bmad/bmm/stories/ACTIVE_STORY.md"
        IF NOT FILE_EXISTS(active_story):
          THROW ERROR("No ACTIVE_STORY - set story before making changes")
        END IF
      END IF
    END FUNCTION,
    
    after_tool_call: FUNCTION(context):
      # Optional: Validate code quality after file write
      IF context.tool_name = "write_file":
        validate_code_quality(context.tool_result.file_path)
      END IF
    END FUNCTION
  }
END FUNCTION

# Register hooks with agent
options.hooks = create_bmad_quality_gate()
```

**Translates to JavaScript:**
```javascript
function createBmadQualityGate() {
  return {
    beforeToolCall: async (context) => {
      if (["write_json", "write_file"].includes(context.toolName)) {
        const activeStory = "bmad/bmm/stories/ACTIVE_STORY.md";
        if (!fs.existsSync(activeStory)) {
          throw new Error("No ACTIVE_STORY - set story before making changes");
        }
      }
    },
    afterToolCall: async (context) => {
      if (context.toolName === "write_file") {
        await validateCodeQuality(context.toolResult.file_path);
      }
    }
  };
}

options.hooks = createBmadQualityGate();
```

---

## Multi-User Isolation

```dsl
FUNCTION get_user_workspace(user_id):
  base_workspaces = "/workspaces"
  user_workspace = base_workspaces + "/" + user_id
  
  IF NOT DIRECTORY_EXISTS(user_workspace):
    CREATE_DIRECTORY(user_workspace)
    CREATE_DIRECTORY(user_workspace + "/data")
    CREATE_DIRECTORY(user_workspace + "/public")
  END IF
  
  RETURN user_workspace
END FUNCTION

FUNCTION initialize_agent_for_user(user_id, message):
  workspace = get_user_workspace(user_id)
  session_id = load_session(user_id)
  
  options = CREATE AgentOptions WITH:
    working_directory = workspace
    system_prompt = "You are a self-editing application assistant"
    allowed_tools = [read_json_tool, write_json_tool, write_file_tool]
    resume_session_id = session_id IF session_id EXISTS
  END WITH
  
  client = CREATE AgentClient(options)
  RETURN client
END FUNCTION
```

**Translates to JavaScript:**
```javascript
function getUserWorkspace(userId) {
  const baseWorkspaces = "/workspaces";
  const userWorkspace = `${baseWorkspaces}/${userId}`;
  
  if (!fs.existsSync(userWorkspace)) {
    fs.mkdirSync(userWorkspace, { recursive: true });
    fs.mkdirSync(`${userWorkspace}/data`);
    fs.mkdirSync(`${userWorkspace}/public`);
  }
  
  return userWorkspace;
}

async function initializeAgentForUser(userId, message) {
  const workspace = getUserWorkspace(userId);
  const sessionId = await loadSession(userId);
  
  const options = {
    cwd: workspace,
    systemPrompt: "You are a self-editing application assistant",
    allowedTools: [readJsonTool, writeJsonTool, writeFileTool],
    ...(sessionId && { resume: sessionId })
  };
  
  const client = new ClaudeSDKClient(options);
  return client;
}
```

---

## Complete HTTP Server Example (DSL)

```dsl
# Express/FastAPI equivalent in DSL

DEFINE Route POST "/chat":
  INPUT: { user_id, message, stream }
  
  HANDLER:
    # Initialize agent for user
    client = initialize_agent_for_user(user_id, message)
    
    # Send query
    AWAIT send_query(client, message)
    
    IF stream = true:
      # Server-Sent Events streaming
      SET_HEADER("Content-Type", "text/event-stream")
      SET_HEADER("Cache-Control", "no-cache")
      
      FOR EACH msg IN AWAIT client.receive_response():
        IF msg IS AssistantMessage:
          FOR EACH block IN msg.content:
            IF block IS TextBlock:
              chunk = { type: "text", content: block.text }
              WRITE_SSE(chunk)
            ELSE IF block IS ToolUseBlock:
              chunk = { type: "tool", name: block.name }
              WRITE_SSE(chunk)
            END IF
          END FOR
        ELSE IF msg IS ResultMessage:
          SAVE_SESSION(user_id, msg.session_id)
          chunk = { type: "done", metrics: msg.usage }
          WRITE_SSE(chunk)
          BREAK
        END IF
      END FOR
      
    ELSE:
      # Non-streaming response
      result = AWAIT process_streaming_response(client, output_handler)
      SAVE_SESSION(user_id, result.session_id)
      RETURN JSON({
        text: result.text,
        tools: result.tools,
        metrics: result.metrics
      })
    END IF
  END HANDLER
END DEFINE
```

**Translates to JavaScript:**
```javascript
app.post('/chat', async (req, res) => {
  const { user_id, message, stream } = req.body;
  
  const client = await initializeAgentForUser(user_id, message);
  await sendQuery(client, message);
  
  if (stream) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    
    for await (const msg of client.receiveResponse()) {
      if (msg.type === 'assistant') {
        for (const block of msg.content) {
          if (block.type === 'text') {
            res.write(`data: ${JSON.stringify({ type: 'text', content: block.text })}\n\n`);
          }
          else if (block.type === 'tool_use') {
            res.write(`data: ${JSON.stringify({ type: 'tool', name: block.name })}\n\n`);
          }
        }
      }
      else if (msg.type === 'result') {
        await saveSession(user_id, msg.session_id);
        res.write(`data: ${JSON.stringify({ type: 'done', metrics: msg.usage })}\n\n`);
        break;
      }
    }
    res.end();
  }
  else {
    const outputHandler = new OutputHandler();
    const result = await processStreamingResponse(client, outputHandler);
    await saveSession(user_id, result.sessionId);
    res.json({
      text: result.text,
      tools: result.tools,
      metrics: result.metrics
    });
  }
});
```

---

## Summary: Complete Implementation Checklist

Using this DSL, implement:

### Core Components
- [ ] `initialize_agent(user_id, message)` → Client setup
- [ ] `send_query(client, message)` → Send user message
- [ ] `process_streaming_response(client, handler)` → Main loop
- [ ] `save_session(user_id, session_id)` → Persistence
- [ ] `load_session(user_id)` → Retrieve previous session

### Optional Components
- [ ] `create_custom_tool(...)` → Custom tool definition
- [ ] `create_bmad_quality_gate()` → Quality hooks
- [ ] `get_user_workspace(user_id)` → Multi-user isolation
- [ ] Error handling wrappers
- [ ] Metrics logging
- [ ] HTTP/WebSocket transport layer

### Testing
- [ ] Test new conversation (no session_id)
- [ ] Test continuing conversation (with session_id)
- [ ] Test tool execution
- [ ] Test error scenarios
- [ ] Test streaming vs non-streaming
- [ ] Test multi-user isolation

---

**This DSL translates to any language:**
- JavaScript/TypeScript (your target)
- Python (reference examples)
- Ruby, Go, Rust, Java, etc.

**Use with AI:**
- Feed this DSL to any AI coding assistant
- Request translation to target language
- Get working implementation

---

**Next**: See python-examples/ for reference behavior
