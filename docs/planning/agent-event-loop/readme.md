# Agent Event Loop Documentation

Language-agnostic specification for implementing Claude Agent SDK event loops.

---

## Files in This Folder

### For Implementation
- **dsl-reference.md** - Complete DSL specification (translate this to your language)
- **core-loop.md** - Detailed event loop patterns and flows
- **overview.md** - Architecture overview and key concepts
- **sdk-summary.md** - What SDK provides vs what you build

---

## Quick Start

1. Read **dsl-reference.md** - it's the complete implementation spec
2. Use AI to translate DSL to JavaScript/TypeScript/Python/etc.
3. Reference **core-loop.md** for detailed behavior

---

## For Your Self-Editing Application

You need to implement:

**From the SDK (automatic):**
- ✅ Agent reasoning loop
- ✅ Tool execution
- ✅ Response streaming
- ✅ Session ID generation
- ✅ Token/cost tracking

**You must build:**
- ❌ HTTP transport (Express + endpoints)
- ❌ Custom tools (read_json, write_json, write_file)
- ❌ Path sandboxing (restrict to /data and /public)
- ❌ BMAD quality gates (check ACTIVE_STORY before writes)
- ❌ Session storage (save session IDs)

See **dsl-reference.md** for complete implementation patterns.

---

## Core Pattern (30 seconds)

```javascript
// 1. Initialize with options
const client = new ClaudeSDKClient({
  cwd: "./",
  systemPrompt: "You are a self-editing application...",
  allowedTools: [readJson, writeJson, writeFile],
  resume: sessionId // optional
});

// 2. Send query
await client.query(userMessage);

// 3. Stream response
for await (const msg of client.receiveResponse()) {
  if (msg.type === 'assistant') {
    // Handle text blocks, tool executions
  }
  if (msg.type === 'result') {
    // Save session_id, track metrics
    break;
  }
}
```

---

**Created**: 2025-11-13
**Source**: Analysis of CLI, Telegram, HTTP API implementations
**Target**: Self-editing application with Express + Claude Agent SDK
