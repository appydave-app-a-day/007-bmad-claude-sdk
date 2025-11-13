# SDK Capabilities Summary

What the Claude Agent SDK provides vs. what you must implement.

---

## What the SDK Provides (Built-in)

| Capability | Status |
|------------|--------|
| Agent reasoning loop | ✅ Built-in |
| Tool execution (automatic) | ✅ Built-in |
| Streaming responses | ✅ Built-in |
| Session persistence (provides ID) | ✅ Built-in |
| Multi-turn conversations | ✅ Built-in |
| Token/cost tracking | ✅ Built-in |
| Working directory context | ✅ Built-in |
| Tool restriction | ✅ Built-in |
| Custom tools (MCP) | ✅ Built-in |

---

## What You Must Implement

| Capability | Status |
|------------|--------|
| Session storage | ❌ User implements |
| Multi-user isolation | ❌ User implements |
| Permission prompts | ❌ User implements |
| Path sandboxing | ❌ User implements |
| Context management | ❌ User implements |
| Undo/redo | ❌ User implements |
| Transport layer (HTTP/WebSocket) | ❌ User implements |

---

## For Your Self-Editing Application

**You get from SDK:**
- ✅ Agent loop that reads/writes files
- ✅ Streaming responses
- ✅ Session management (conversation history)
- ✅ Custom tools (read_json, write_json, write_file)
- ✅ Token/cost tracking

**You must implement:**
- ❌ Path sandboxing (restrict to `data/` and `public/`)
- ❌ BMAD quality gates (active story enforcement)
- ❌ HTTP transport (Express + SSE)
- ❌ Frontend (HTML + JavaScript)
- ❌ Session storage (in-memory or file-based)

**The SDK gives you ~80% of Claude Code's capabilities for free.**

---

## Security & Sandboxing

### SDK Does NOT Enforce
- No built-in permission system (auto-executes all tools)
- No built-in sandboxing (tools have full filesystem access)
- No built-in context management
- No built-in undo/redo

### You Must Add
```javascript
// Path sandboxing example
const safe = (filepath) => {
  const full = path.resolve(filepath);
  if (!full.startsWith(PUBLIC_DIR) && !full.startsWith(DATA_DIR)) {
    throw new Error('Blocked: only /public and /data writable');
  }
  return full;
};

// BMAD quality gate
const hooks = {
  async beforeToolCall(ctx) {
    if (ctx.toolName === 'write_file') {
      const active = 'bmad/bmm/stories/ACTIVE_STORY.md';
      try {
        await fs.access(active);
      } catch {
        throw new Error('No ACTIVE_STORY - set story first');
      }
    }
  }
};
```

---

## Configuration Options

```javascript
const options = {
  cwd: string,              // Working directory
  systemPrompt: string,     // Agent behavior
  allowedTools: string[],   // Which tools to enable
  mcpServers: object,       // External tool servers (optional)
  resume: string            // Session ID to continue (optional)
};
```

---

## Message Types

**AssistantMessage:**
- Contains text blocks and tool usage
- Streamed as agent generates response

**ToolUseBlock:**
- Agent executing a tool
- Automatic execution by SDK

**ResultMessage:**
- Final metadata (tokens, cost, duration, session_id)
- Signals end of response

---

**See**: `08-dsl-reference.md` for complete implementation patterns
