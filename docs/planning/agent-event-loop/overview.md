# Agent Event Loop - Complete Documentation

**Purpose**: Language-agnostic documentation of the Claude Agent SDK event loop architecture

**Use Case**: Reference for implementing agent loops in any programming language (JavaScript, Python, Ruby, etc.)

---

## Documentation Structure

This folder contains a complete breakdown of the Agent Event Loop pattern observed across multiple implementations (CLI, Telegram, HTTP API).

### Files in This Folder

1. **00-overview.md** (this file) - Navigation and introduction
2. **01-core-loop.md** - The fundamental event loop pattern
3. **02-initialization.md** - Client setup and configuration
4. **03-session-management.md** - Session persistence and resumption
5. **04-streaming.md** - Response streaming patterns
6. **05-tool-execution.md** - Tool invocation and results
7. **06-error-handling.md** - Error scenarios and recovery
8. **07-observability.md** - Logging, metrics, and monitoring
9. **08-dsl-reference.md** - Human-readable DSL for implementation
10. **python-examples/** - Reference implementations from analysis
11. **javascript-pseudocode/** - Target language patterns

---

## Quick Start: The 3-Layer Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Layer 1: Transport (HTTP/Telegram/CLI/WebSocket)      │
│  - Receives user messages                              │
│  - Sends responses back to user                        │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────────────────┐
│  Layer 2: Agent Event Loop (THIS IS WHAT WE DOCUMENT)  │
│  - Initialize client with options                      │
│  - Send query to agent                                 │
│  - Stream response blocks                              │
│  - Execute tools automatically                         │
│  - Manage session state                                │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────────────────┐
│  Layer 3: Authentication & API (SDK Internal)          │
│  - Handle authentication                               │
│  - Communicate with Anthropic API                      │
│  - Return streaming responses                          │
└─────────────────────────────────────────────────────────┘
```

**Focus**: Layer 2 is what you implement. Layers 1 and 3 are environment-specific.

---

## Core Concepts

### 1. Stateful vs Stateless

**Stateless (`query()` function):**
- One-shot interaction
- No session persistence
- Simplified wrapper
- Good for: Simple Q&A, testing

**Stateful (`ClaudeSDKClient` class):**
- Multi-turn conversations
- Session persistence
- Full event loop
- Good for: Chatbots, applications, complex workflows

**Your self-editing app needs**: Stateful (ClaudeSDKClient pattern)

### 2. Event Loop Phases

```
INITIALIZATION
  ↓
  Create client with options (cwd, tools, system prompt)
  ↓
QUERY
  ↓
  Send user message to agent
  ↓
STREAMING LOOP
  ↓
  FOR EACH message in stream:
    IF message = AssistantMessage:
      FOR EACH block in message.content:
        IF block = TextBlock:
          → Display/buffer text
        IF block = ToolUseBlock:
          → Log tool execution
          → Tool runs automatically
    IF message = ResultMessage:
      → Capture session_id
      → Capture tokens/cost/duration
      → End streaming loop
  ↓
SESSION PERSISTENCE
  ↓
  Save session_id for next interaction
  ↓
READY FOR NEXT QUERY (or end)
```

### 3. Message Types (Streaming Blocks)

```
AssistantMessage
  ├─ TextBlock → Agent's text response
  ├─ ToolUseBlock → Agent is calling a tool
  └─ ToolResultBlock → Tool execution result

ResultMessage
  ├─ session_id → For resuming conversation
  ├─ usage → Token counts (input/output/cache)
  ├─ total_cost_usd → Cost tracking
  ├─ duration_ms → Performance metrics
  └─ num_turns → Conversation complexity
```

### 4. Configuration Options

```
AgentOptions:
  - cwd → Working directory for file operations
  - system_prompt → Agent behavior definition
  - allowed_tools → Which tools agent can use
  - mcp_servers → External tool servers
  - resume → Session ID to continue conversation
```

---

## Implementation Checklist

When implementing an agent event loop, you need:

### Required Components
- [ ] Client initialization with options
- [ ] Query method to send user messages
- [ ] Streaming response handler
- [ ] Message type detection (Assistant vs Result)
- [ ] Block type detection (Text vs Tool)
- [ ] Session ID capture and storage

### Optional Components
- [ ] Session persistence (file/database)
- [ ] Tool execution logging
- [ ] Token/cost tracking
- [ ] Error handling and recovery
- [ ] Multi-user isolation
- [ ] Context management
- [ ] Hooks (before/after tool calls)

### Transport Layer (Choose One)
- [ ] HTTP endpoint (Express/FastAPI)
- [ ] WebSocket server
- [ ] Terminal CLI
- [ ] Telegram/Discord bot
- [ ] Other messaging platform

---

## Language-Agnostic Patterns

Each implementation guide shows:

1. **Initialization Pattern** - How to set up the client
2. **Query Pattern** - How to send messages
3. **Streaming Pattern** - How to receive responses
4. **Session Pattern** - How to persist state
5. **Error Pattern** - How to handle failures

**These patterns are identical** across:
- Python (reference from examples)
- JavaScript/TypeScript (target for your app)
- Ruby (potential future implementation)
- Any other language

---

## Reading Order

**For Understanding:**
1. Read 01-core-loop.md (fundamental pattern)
2. Read 08-dsl-reference.md (human-readable spec)
3. Skim 02-07 for specific capabilities

**For Implementation:**
1. Start with 08-dsl-reference.md (complete spec)
2. Reference 02-initialization.md (setup)
3. Reference 04-streaming.md (core loop)
4. Reference 03-session-management.md (persistence)
5. Add 05-07 as needed (tools, errors, observability)

**For JavaScript Implementation:**
1. Use DSL from 08-dsl-reference.md
2. Translate using AI or manual coding
3. Reference python-examples/ for behavior
4. Check javascript-pseudocode/ for patterns

---

## Key Insights from Analysis

### What We Learned

1. **Transport is irrelevant** - CLI, Telegram, HTTP all have identical event loop
2. **Initialization != Event Loop** - Authentication happens before loop starts
3. **Streaming is block-level** - Not token-level (complete thoughts)
4. **Tools execute automatically** - Agent decides, SDK executes
5. **Session persistence is manual** - SDK provides session_id, you store it
6. **~80% of Claude Code** - Event loop gives most capabilities for free

### What You Must Implement

1. **Transport layer** - HTTP/WebSocket/etc
2. **Session storage** - File/database/memory
3. **User isolation** - If multi-user
4. **Custom tools** - read_json, write_json, write_file
5. **Sandboxing** - Path restrictions
6. **Hooks** - BMAD quality gates

### What SDK Provides

1. **Agent reasoning loop** - Automatic
2. **Tool execution** - Automatic
3. **Streaming** - Automatic
4. **Session ID generation** - Automatic
5. **Token/cost tracking** - Automatic
6. **MCP server integration** - Automatic

---

## Next Steps

1. Read through documentation files in order
2. Study DSL in 08-dsl-reference.md
3. Translate DSL to JavaScript for your self-editing app
4. Reference Python examples for expected behavior
5. Implement with confidence!

---

**Created**: 2025-11-13
**Source**: Analysis of CLI, Telegram, and HTTP API implementations
**Target**: Self-editing application with Express + Claude Agent SDK
