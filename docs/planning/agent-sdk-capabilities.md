# Claude Agent SDK - Complete Event Loop Capabilities

**Date:** 2025-11-12
**Purpose:** Catalog the full capability set of the Claude Agent SDK event loop (independent of transport layer)

---

## Core Agent Loop Pattern

```python
options = ClaudeAgentOptions(...)
async with ClaudeSDKClient(options=options) as client:
    await client.query(user_message)
    async for message in client.receive_response():
        # Handle AssistantMessage, ToolUseBlock, ResultMessage
```

---

## Configuration Capabilities (`ClaudeAgentOptions`)

### 1. **Working Directory**
```python
cwd: str  # Filesystem context for all tool operations
```
- Sets the base directory for file operations
- All tools (Read, Write, Edit, Bash) operate relative to this path
- Can be per-user, per-session, or global

### 2. **System Prompt**
```python
system_prompt: str  # Agent behavior and personality
```
- Defines agent role, capabilities, constraints
- Can be generic ("helpful assistant") or specialized ("self-editing application")
- Controls agent's understanding of its purpose

### 3. **Allowed Tools**
```python
allowed_tools: List[str]  # Which tools the agent can use
```

**Built-in Tools:**
- `Read` - Read files from filesystem
- `Write` - Write/create files
- `Edit` - Modify existing files
- `Bash` - Execute shell commands
- Custom MCP tools (e.g., `mcp__sequential-thinking`)

**Custom Tools (via MCP):**
- Can add domain-specific tools (e.g., `read_json`, `write_json`, `validate_code`)

### 4. **MCP Server Integration**
```python
mcp_servers: Dict[str, Dict]  # External tool servers
```

**Example:**
```python
mcp_servers: {
    "sequential-thinking": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    }
}
```
- Extends tool capabilities beyond built-in set
- Tools run as external processes
- Agent SDK communicates via Model Context Protocol

### 5. **Session Resumption**
```python
resume: str  # Session ID to continue previous conversation
```
- Restores conversation history
- Maintains context across interactions
- Enables multi-turn conversations

---

## Execution Capabilities

### 1. **Query Execution**
```python
await client.query(user_message: str)
```
- Sends user message to agent
- Initiates agent reasoning loop
- Non-blocking (async)

### 2. **Response Streaming**
```python
async for message in client.receive_response():
    # Stream responses as they're generated
```

**Message Types:**
- `AssistantMessage` - Contains text and tool usage
- `ToolUseBlock` - Agent executing a tool
- `ToolResultBlock` - Result from tool execution
- `ResultMessage` - Final metadata (tokens, cost, session ID)

### 3. **Block-Level Streaming**
```python
if isinstance(message, AssistantMessage):
    for block in message.content:
        if isinstance(block, TextBlock):
            # Text content from agent
        elif isinstance(block, ToolUseBlock):
            # Tool being executed
```
- Not token-by-token (like raw LLM APIs)
- Block-by-block (complete thoughts or tool calls)
- Allows real-time UI updates

### 4. **Tool Execution (Automatic)**
- Agent decides when to use tools
- SDK automatically executes tools
- Results fed back to agent
- Multi-turn tool loops possible

**Example Flow:**
```
User: "Read README.md and summarize"
  ↓
Agent: [Uses Read tool] → reads file
  ↓
Agent: [Generates summary] → text response
```

### 5. **Multi-Turn Reasoning**
- Agent can execute multiple tool calls in sequence
- Agent can iterate (read → analyze → write → verify)
- No hardcoded limit on turns (configurable)

---

## Session Management Capabilities

### 1. **Session Persistence**
```python
if isinstance(message, ResultMessage):
    session_id = message.session_id
    # Save for future use
```
- Every interaction produces a session ID
- Session ID can be used to resume conversation
- Preserves full conversation history

### 2. **Context Retention**
- Agent remembers all previous messages in session
- Tools executed in previous turns are remembered
- File modifications persist across turns

### 3. **Session Isolation**
- Each session is independent
- Multiple users can have separate sessions
- Sessions don't interfere with each other

---

## Metadata & Observability Capabilities

### 1. **Token Usage Tracking**
```python
if isinstance(message, ResultMessage):
    usage = message.usage
    # {
    #   "input_tokens": 1234,
    #   "output_tokens": 567,
    #   "cache_read_input_tokens": 890,
    #   "cache_creation_input_tokens": 100
    # }
```
- Track prompt tokens consumed
- Track completion tokens generated
- Track prompt caching efficiency

### 2. **Cost Tracking**
```python
total_cost_usd = message.total_cost_usd
```
- Calculates cost based on token usage
- Includes caching discounts
- Real-time cost visibility

### 3. **Duration Tracking**
```python
duration_ms = message.duration_ms  # Total duration
duration_api_ms = message.duration_api_ms  # API-only duration
```
- Measure end-to-end latency
- Separate API time from SDK overhead

### 4. **Turn Counting**
```python
num_turns = message.num_turns
```
- How many back-and-forth exchanges occurred
- Indicates reasoning complexity

---

## Advanced Capabilities

### 1. **Streaming vs Non-Streaming**
```python
# Streaming (real-time updates):
async for message in client.receive_response():
    yield message

# Non-streaming (wait for complete response):
messages = []
async for message in client.receive_response():
    messages.append(message)
# Process complete response
```

### 2. **Error Handling**
```python
try:
    async with ClaudeSDKClient(options=options) as client:
        await client.query(message)
        async for msg in client.receive_response():
            ...
except Exception as e:
    # Authentication errors
    # Tool execution errors
    # API errors
```

### 3. **Hooks (Potential - Not Shown in Examples)**
```python
# Hypothetical (for your BMAD integration):
hooks = {
    "before_tool_call": async (ctx) => {
        # Check ACTIVE_STORY exists
    },
    "after_tool_call": async (ctx) => {
        # Validate code quality
    }
}
```

---

## Model Capabilities

### 1. **Model Selection**
```python
# Implied by SDK - uses Claude Sonnet 4.5
# Model ID: claude-sonnet-4-5-20250929
```

### 2. **Multimodal Input (Potential)**
```python
# OpenAI-compatible API example shows:
content: Union[str, List[dict]]  # Text or multimodal array
```
- Text messages (confirmed)
- Image input (potential, not shown in examples)

### 3. **Temperature Control (via API wrapper)**
```python
temperature: float = 1.0  # Only in OpenAI-compatible wrapper
```
- Not directly exposed in ClaudeSDKClient examples
- May be configurable in agent options

---

## Filesystem Capabilities (via Tools)

### 1. **Read Operations**
- Read any file in `cwd` or subdirectories
- No path restrictions (unless custom tools add them)

### 2. **Write Operations**
- Create new files
- Overwrite existing files
- Create directories (if needed)

### 3. **Edit Operations**
- Modify existing files in-place
- Line-by-line edits or full rewrites

### 4. **Bash Execution**
- Run any shell command in `cwd`
- Capture stdout/stderr
- Full shell access (dangerous if not sandboxed)

---

## Security & Sandboxing Capabilities

### 1. **Working Directory Restriction**
```python
cwd: str  # Limits tool operations to this directory
```
- Tools operate relative to `cwd`
- Does NOT enforce hard restrictions (tools can `cd ..`)

### 2. **Tool Restriction**
```python
allowed_tools: List[str]  # Only these tools can be used
```
- Limit agent to safe subset (e.g., no Bash)
- Custom tools can enforce stricter rules

### 3. **Custom Tool Sandboxing (User-Implemented)**
```python
# Example from project planning:
const safe = (p) => {
  const full = path.resolve(p);
  if (!full.startsWith(PUBLIC_DIR) && !full.startsWith(DATA_DIR)) {
    throw new Error('Blocked: only /public and /data writable');
  }
  return full;
};
```
- SDK does NOT enforce sandboxing by default
- Must be implemented in custom tools

---

## Multi-User Capabilities

### 1. **Per-User Sessions**
- Store session_id per user (user_id → session_id mapping)
- Each user gets isolated conversation history

### 2. **Per-User Workspaces**
- Store `cwd` per user
- Each user operates in their own directory
- File operations don't interfere

### 3. **Concurrent Users**
- Multiple users can interact simultaneously
- Each gets their own `ClaudeSDKClient` instance
- Sessions are independent

---

## Performance & Optimization

### 1. **Prompt Caching**
```python
cache_read_input_tokens: int  # Tokens read from cache
cache_creation_input_tokens: int  # Tokens written to cache
```
- Automatic prompt caching by Anthropic API
- Reduces cost and latency for repeated context
- No configuration needed (automatic)

### 2. **Asynchronous Execution**
- All operations are async (`async/await`)
- Non-blocking I/O
- Can handle multiple concurrent requests

### 3. **Streaming Response**
- Start displaying results before completion
- Reduces perceived latency
- Better user experience

---

## Integration Capabilities

### 1. **Transport Agnostic**
```
✅ Terminal (stdin/stdout)
✅ Telegram (polling + send_message)
✅ HTTP REST API (POST + JSON/SSE)
✅ WebSocket (potential)
✅ Discord/Slack (potential)
```
- Core agent loop is independent of transport
- Wrap with any I/O layer

### 2. **Format Conversion**
```python
# Convert SDK messages to OpenAI format:
async for openai_chunk in convert_sdk_to_openai_stream(client.receive_messages()):
    yield openai_chunk
```
- Can translate to other API formats
- Enables compatibility with existing tools

### 3. **Observability Integration**
```python
# Sentry example from Telegram bot:
with sentry_sdk.start_transaction(op="gen_ai.invoke_agent"):
    async with ClaudeSDKClient(...) as client:
        # Automatic tracking of tokens, cost, duration
```
- Can wrap agent loop with monitoring
- Extract metrics from `ResultMessage`

---

## Limitations & Constraints

### 1. **No Built-in Permission System**
- Agent auto-executes all tools
- No "ask user before running this" prompts
- Must be implemented externally

### 2. **No Built-in Sandboxing**
- Tools have full filesystem access within `cwd`
- Bash tool can execute any command
- Security must be implemented in custom tools

### 3. **No Built-in Context Management**
- No automatic token budget tracking
- No automatic context pruning
- No file summary generation
- Must be managed externally

### 4. **No Built-in Undo/Redo**
- No branching conversation history
- No rollback to previous state
- Must be implemented externally (like Claude Code does)

### 5. **Session Storage is External**
- SDK provides session_id but doesn't store it
- Must implement own persistence (files, database, etc.)

---

## Summary: What the Event Loop CAN Do

| Capability | Provided by SDK |
|------------|-----------------|
| Agent reasoning loop | ✅ Built-in |
| Tool execution (auto) | ✅ Built-in |
| Streaming responses | ✅ Built-in |
| Session persistence | ✅ Built-in (provides ID) |
| Session storage | ❌ User implements |
| Multi-turn conversations | ✅ Built-in |
| Token/cost tracking | ✅ Built-in |
| Working directory context | ✅ Built-in |
| Tool restriction | ✅ Built-in |
| Custom tools (MCP) | ✅ Built-in |
| Multi-user isolation | ❌ User implements |
| Permission prompts | ❌ User implements |
| Path sandboxing | ❌ User implements |
| Context management | ❌ User implements |
| Undo/redo | ❌ User implements |
| Transport layer | ❌ User implements |

---

## For Your Self-Editing Application

**You get from SDK:**
- ✅ Agent loop that reads/writes files
- ✅ Streaming responses
- ✅ Session management (conversation history)
- ✅ Custom tools (read_json, write_json, write_file)
- ✅ Token/cost tracking

**You must implement:**
- Path sandboxing (restrict to `data/` and `public/`)
- BMAD quality gates (active story enforcement)
- HTTP transport (Express + SSE)
- Frontend (HTML + JavaScript)
- Session storage (in-memory or file-based)

**The SDK gives you ~80% of Claude Code's capabilities for free.**

---

**Last Updated:** 2025-11-12
