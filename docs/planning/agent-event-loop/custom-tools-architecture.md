# Custom Tools Architecture: SDK MCP Servers vs External MCP vs Skills

**Purpose**: Clarify the correct approach for implementing custom tools in Claude Agent SDK, resolve permission issues, and explain why SDK MCP servers are the right choice for this project.

**Created**: 2025-11-16
**Context**: Story 2.4 - Implement Custom Tool: read_json
**Issue**: Agent asking for permission to use `mcp__custom-tools__read_json` tool

---

## Executive Summary

### The Verdict: Current Implementation is CORRECT ✅

**Your current architecture using `createSdkMcpServer()` is the recommended pattern for custom tools in the Agent SDK.**

**The only issue:** Missing `permissionMode` configuration in `agentOptions`.

**Quick fix:** Add `permissionMode: 'acceptEdits'` to agent configuration.

---

## Three Approaches to Tools (Comparison)

| Approach | What It Is | When to Use | Your Use Case |
|----------|-----------|-------------|---------------|
| **1. Built-in Tools** | Read, Write, Edit, Bash, WebSearch | Always available in Agent SDK | ❌ Too generic - you need JSON-specific logic |
| **2. SDK MCP Server** (In-Process) | Custom TypeScript/Python functions wrapped in MCP interface | **Application-specific business logic** | ✅ **CORRECT CHOICE** |
| **3. External MCP Server** (Subprocess) | Separate process (e.g., SQLite, Slack, GitHub) | External service integration | ❌ Overkill - your tools are app logic, not external services |
| **4. Skills** | YAML + markdown files for Claude Code CLI | Extending Claude Code CLI capabilities | ❌ Wrong - Skills are for CLI, not Agent SDK apps |

---

## Why SDK MCP Servers Are the Right Choice

### What "SDK MCP Server" Actually Means

From Python SDK documentation:

> "Custom tools are implemented in-process MCP servers that run directly within your Python application, eliminating the need for separate processes that regular MCP servers require."

**Think of it as:**
- **NOT**: "I'm connecting to an external MCP service like Slack/GitHub"
- **YES**: "I'm wrapping my TypeScript functions in Claude's tool interface format"

### The MCP Interface is Just a Wrapper

```typescript
// Your business logic (the actual function)
async function readJsonFile(filepath: string) {
  const fullPath = validatePath(filepath, DATA_DIR);
  const content = await fs.readFile(fullPath, 'utf-8');
  return JSON.parse(content);
}

// Wrapped in SDK MCP format (so Claude can understand it)
const readJsonTool = tool(
  'read_json',
  'Read and parse a JSON file from the /data directory',
  { filepath: z.string() },
  async (args) => {
    const data = await readJsonFile(args.filepath);
    return {
      content: [{ type: 'text', text: JSON.stringify(data, null, 2) }]
    };
  }
);

// Packaged as SDK MCP server (collection of tools)
const customToolsServer = createSdkMcpServer({
  name: 'custom-tools',
  version: '1.0.0',
  tools: [readJsonTool, writeJsonTool, writeFileTool]
});
```

**Why this pattern:**
- Claude Agent SDK requires tools to follow MCP specification
- `tool()` and `createSdkMcpServer()` are helpers that create the correct format
- Your code stays simple TypeScript functions
- No subprocesses, no IPC, no complexity

### Benefits Over External MCP Servers

| Feature | SDK MCP Server | External MCP Server |
|---------|----------------|---------------------|
| **Process** | In-process (same as your Express app) | Separate subprocess |
| **Performance** | Direct function calls | IPC overhead (stdio/SSE) |
| **Deployment** | Single process | Multiple processes to manage |
| **Debugging** | Easy - all in one codebase | Hard - cross-process debugging |
| **Type Safety** | TypeScript types throughout | Serialization boundaries |
| **Use Case** | **Application business logic** | External service integration |

**Your tools (`read_json`, `write_json`, `write_file`) are application-specific business logic, not external services.**

---

## The Permission Problem (Root Cause Analysis)

### What's Happening

**User asks:** "Can you read from the test products table?"

**Agent responds:** "Could you grant me permission to use the `mcp__custom-tools__read_json` tool?"

### Why This Happens

**From your code** (`packages/server/src/agent/agent-config.ts:40-48`):
```typescript
agentOptions = {
  systemPrompt: SYSTEM_PROMPT,
  mcpServers: {
    'custom-tools': customToolsServer,
  },
  maxTurns: 10,
  // ❌ NO PERMISSION MODE CONFIGURED
};
```

**Agent SDK default behavior:**
- When no `permissionMode` is set, SDK defaults to requiring approval
- Agent can SEE the tool (it's registered)
- Agent WANTS to use the tool
- Agent is BLOCKED from executing without permission
- Agent asks user in natural language (because event loop doesn't handle approval events)

### The Fix: Add Permission Mode

**Pattern from Python SDK** (README.md lines 56-59):
```python
options = ClaudeAgentOptions(
    allowed_tools=["Read", "Write", "Bash"],
    permission_mode='acceptEdits'  # auto-accept file edits
)
```

**TypeScript equivalent:**
```typescript
agentOptions = {
  systemPrompt: SYSTEM_PROMPT,
  mcpServers: {
    'custom-tools': customToolsServer,
  },
  permissionMode: 'acceptEdits',  // ← ADD THIS
  maxTurns: 10,
};
```

**Alternative property names to try** (SDK may use different casing):
- `permissionMode: 'acceptEdits'`
- `permissionMode: 'accept_edits'`
- `permission_mode: 'acceptEdits'`
- Check TypeScript `Options` interface for exact property name

---

## Implementation Guide

### Current File: `packages/server/src/agent/agent-config.ts`

**Current code (lines 40-48):**
```typescript
agentOptions = {
  systemPrompt: SYSTEM_PROMPT,
  mcpServers: {
    'custom-tools': customToolsServer,
  },
  maxTurns: 10,
};
```

### Solution 1: Minimal Fix (For Testing)

**Add permission mode only:**
```typescript
agentOptions = {
  systemPrompt: SYSTEM_PROMPT,
  mcpServers: {
    'custom-tools': customToolsServer,
  },
  permissionMode: 'acceptEdits',  // ← ADD THIS LINE
  maxTurns: 10,
};
```

**Why this works:**
- Disables approval requirement for tool execution
- Agent can execute tools automatically
- Matches Story 2.4 test scenario (reading test-products.json)

**When to use:**
- Development and testing
- Controlled environments (single user, trusted inputs)
- MVP/demo scenarios

### Solution 2: Production-Ready (Recommended)

**Add permission mode + explicit tool whitelist:**
```typescript
agentOptions = {
  systemPrompt: SYSTEM_PROMPT,
  mcpServers: {
    'custom-tools': customToolsServer,
  },
  allowedTools: [
    'mcp__custom-tools__read_json',
    'mcp__custom-tools__write_json',
    'mcp__custom-tools__write_file',
  ],
  permissionMode: 'acceptEdits',
  maxTurns: 10,
};
```

**Benefits:**
- Explicit documentation of available tools
- Prevents accidental tool expansion
- Reduces token usage (only whitelisted tools in context)
- Follows Python SDK pattern (README.md:56-66)
- Production-ready security posture

**When to use:**
- Production deployments
- Multi-user environments
- Security-conscious applications

### Solution 3: Approval Flow (Future Enhancement)

If you want to KEEP approval mode and handle it properly:

**Requires:**
1. Add approval event handling to event loop (`packages/server/src/agent/event-loop.ts`)
2. Add Socket.io approval events (bidirectional communication)
3. Add client-side approval UI (Epic 3 React work)

**Example event loop modification:**
```typescript
for await (const chunk of queryIterator) {
  // Check if chunk is a tool approval request
  if (chunk.type === 'tool_approval_request') {
    socket.emit('tool_approval_request', {
      toolName: chunk.toolName,
      parameters: chunk.parameters,
      messageId,
    });

    const approved = await waitForApproval(socket, messageId);
    // Send approval response back to SDK
    continue;
  }

  // Existing text chunk handling...
}
```

**Not recommended for Story 2.4** - adds significant complexity.

---

## Why Skills Are NOT the Answer

### What Are Skills?

**Skills** = YAML + markdown files in `.claude/skills/` directory that extend Claude Code CLI

**Example skill structure:**
```
~/.claude/skills/my-skill/
├── SKILL.md          # YAML frontmatter + instructions
└── resources/        # Supporting files
```

**Skills are for:**
- Extending your LOCAL Claude Code CLI instance
- Single-user desktop workflows
- Adding capabilities to the Claude Code tool you use in terminal

### Why Skills Don't Apply Here

| Requirement | Skills | Agent SDK (Your Use Case) |
|-------------|--------|---------------------------|
| Multi-user server | ❌ Single user | ✅ Multi-user via Express |
| Custom business logic | ❌ System-level capabilities | ✅ App-specific functions |
| Per-user workspaces | ❌ One workspace | ✅ `/workspaces/{user_id}/` |
| HTTP/WebSocket API | ❌ CLI only | ✅ Server deployment |
| Custom data directories | ❌ Global scope | ✅ `/data/` per workspace |

**Your project is:**
- Express server with Socket.io ✅
- Multi-user conversational app builder ✅
- Custom `/data` directory sandboxing ✅
- HTTP API for client connections ✅

**Skills cannot do this.** You need the Agent SDK with custom tools.

---

## Conceptual Model: Tools Are Like Built-in Tools

### How to Think About Your Custom Tools

**Built-in tools in Agent SDK:**
- `Read` - Read files from workspace
- `Write` - Create files in workspace
- `Edit` - Modify existing files
- `Bash` - Execute shell commands

**Your custom tools:**
- `read_json` - Read JSON files **from `/data` directory specifically**
- `write_json` - Write JSON files **to `/data` directory specifically**
- `write_file` - Write HTML/CSS/JS **to `/public` directory specifically**

**What makes them "custom":**
- Domain-specific paths (`/data`, `/public`)
- Validation rules (path sandboxing, JSON parsing)
- Application business logic (product data, user data, app files)

**They're still tools, just specialized versions.**

The SDK MCP server wrapper makes them look like built-in tools to Claude, but with your custom logic.

---

## Testing the Fix

### Manual Test Steps (Story 2.4 AC #9)

**After adding `permissionMode: 'acceptEdits'`:**

1. **Start server:**
   ```bash
   cd packages/server
   npm run dev
   ```

2. **Connect client and send message:**
   ```
   "Read the test-products.json file"
   ```

3. **Expected behavior:**
   - ✅ Console shows: `Reading JSON file: /path/to/data/test-products.json`
   - ✅ Console shows: `Successfully read test-products.json`
   - ✅ Agent response streams back with product data:
     ```json
     {
       "products": [
         { "id": 1, "name": "Widget A", "price": 19.99 },
         { "id": 2, "name": "Widget B", "price": 29.99 },
         { "id": 3, "name": "Widget C", "price": 39.99 }
       ],
       "total": 3
     }
     ```
   - ✅ **NO "Could you grant me permission" message**

4. **What changed:**
   - **Before:** Agent asks for permission in natural language
   - **After:** Agent executes tool automatically and returns results

### Error Test Cases

**Test path traversal protection:**
```
"Read the file ../etc/passwd"
```
Expected: Error message about invalid path

**Test non-existent file:**
```
"Read nonexistent.json"
```
Expected: File not found error

**Test invalid JSON:**
```
Create data/broken.json with invalid JSON
"Read broken.json"
```
Expected: Invalid JSON error

---

## Architecture Validation

### Why This is the Right Pattern

**From official Python SDK documentation** (README.md:84-136):

> "Unlike `query()`, `ClaudeSDKClient` additionally enables **custom tools** and **hooks**, both of which can be defined as Python functions."

> "Custom tools are implemented in-process MCP servers that run directly within your Python application, eliminating the need for separate processes that regular MCP servers require."

**Benefits listed:**
- ✅ No subprocess management
- ✅ Better performance (no IPC overhead)
- ✅ Simpler deployment (single process)
- ✅ Easier debugging
- ✅ Type safety with TypeScript/Python functions

**Your implementation matches this exactly:**
```typescript
// 1. Define tool function
export const readJsonTool = tool(/* ... */);

// 2. Create SDK MCP server
const customToolsServer = createSdkMcpServer({
  name: 'custom-tools',
  tools: [readJsonTool]
});

// 3. Register with agent
agentOptions = {
  mcpServers: { 'custom-tools': customToolsServer }
};
```

**This is the canonical pattern for custom tools in Agent SDK.**

---

## Common Misconceptions (Debunked)

### Misconception 1: "MCP means external service"

❌ **Wrong:** "I'm using MCP, so I must be connecting to Slack/GitHub/external API"

✅ **Correct:** "SDK MCP servers are in-process function wrappers for application logic"

### Misconception 2: "I should use Skills instead"

❌ **Wrong:** "Skills would be simpler for custom tools"

✅ **Correct:** "Skills are for Claude Code CLI, not for Agent SDK server applications"

### Misconception 3: "There's a native tools array"

❌ **Wrong:** "I can pass an array of functions to `allowedTools`"

✅ **Correct:** "Custom tools must be wrapped in SDK MCP servers; `allowedTools` is for filtering/whitelisting"

### Misconception 4: "MCP adds complexity"

❌ **Wrong:** "Using MCP makes my code more complicated"

✅ **Correct:** "SDK MCP is a thin wrapper; your actual code is simple TypeScript functions"

---

## Next Steps (Story 2.4 Completion)

### Immediate Actions

1. **Update `packages/server/src/agent/agent-config.ts`:**
   - Add `permissionMode: 'acceptEdits'` to `agentOptions`
   - Optionally add `allowedTools` array for explicit whitelisting

2. **Verify TypeScript `Options` interface:**
   - Check exact property name (`permissionMode` vs `permission_mode`)
   - Confirm available values (`'acceptEdits'` vs `'accept_edits'`)

3. **Test manually** (Story 2.4 AC #9):
   - Start server
   - Request: "Read the test-products.json file"
   - Verify: Tool executes automatically without permission request

4. **Document findings in SAT:**
   - Add section to `docs/stories/2.4.story-SAT.md`
   - Note: "Tool Approval Configuration"
   - Record working property name and value

### Future Enhancements

**Story 2.5-2.6:** Implement `write_json` and `write_file` tools
- Use same SDK MCP server pattern
- Add to `tools` array in `createSdkMcpServer()`
- Register in `allowedTools` if using whitelist approach

**Epic 3:** If approval flow is needed:
- Implement approval event handling in event loop
- Add Socket.io approval events
- Create client-side approval UI component

---

## References

### Official Documentation

- **Python SDK README**: `/Users/davidcruwys/dev/python_3rd/claude-agent-sdk-python/README.md`
  - Lines 84-162: Custom Tools (SDK MCP Servers)
  - Lines 56-59: Permission mode configuration
  - Line 92: MCP Calculator example

- **Second Brain**: `/Users/davidcruwys/dev/ad/brains/anthropic-claude/`
  - `agent-sdk/sdk-technical-patterns.md` (lines 249-328): Tools & Permissions, MCP Integration

### Project Files

- **Agent Configuration**: `packages/server/src/agent/agent-config.ts` (lines 28-84)
- **Tool Implementation**: `packages/server/src/tools/read-json.ts` (lines 35-132)
- **Event Loop**: `packages/server/src/agent/event-loop.ts` (lines 31-124)
- **Story Spec**: `docs/stories/2.4.story.md`

---

## Summary

**You made the right architectural choice.** SDK MCP servers are the correct pattern for custom tools in Agent SDK applications.

**The issue is simple:** Add `permissionMode: 'acceptEdits'` to your agent options.

**No need to refactor.** Your code structure is sound, follows official patterns, and will scale as you add more tools in Stories 2.5-2.6.

**MCP is not the enemy** - it's just the interface format that Claude requires. Think of it as a thin wrapper around your business logic, not as a complex external service integration.

---

**Last Updated**: 2025-11-16
**Next Review**: After Story 2.4 SAT completion
