# Authentication Spike Tests

**Purpose**: Verify that authentication is required BEFORE using Claude Agent SDK.

**Conclusion**: ✅ Confirmed - Authentication (API key or `claude auth login`) must be configured before SDK usage.

---

## What These Tests Do

All three tests answer the same question: **"Can I use the Agent SDK without setting up authentication first?"**

**Answer**: NO - Authentication is a prerequisite at the initialization layer.

---

## Three Test Approaches

### 1. test-comprehensive.mjs (143 lines)
**Production-ready diagnostic tool** with extensive environment checks.

**Features**:
- Checks ANTHROPIC_API_KEY environment variable
- Inspects ~/.claude directory and files
- Detailed error categorization
- Fancy console formatting (═══, ───)
- Suggests specific fixes based on error type

**Use when**: You need to **debug authentication problems** or understand the full authentication flow.

**Run**:
```bash
node test-comprehensive.mjs
```

**Example Output**:
```
═══════════════════════════════════════
  Testing Claude Agent SDK Authentication
═══════════════════════════════════════

Environment Check:
───────────────────
ANTHROPIC_API_KEY: SET
HOME: /Users/username
~/.claude exists: true
~/.claude files: [ 'session-env', 'config.json' ]

✅ SUCCESS: Authentication configured correctly
```

---

### 2. test-minimal.mjs (38 lines)
**Simple proof-of-concept** test with minimal code.

**Features**:
- Basic try/catch pattern
- Simple success/failure messages
- No environment diagnostics
- Easy to understand quickly

**Use when**: You just need to **verify authentication works** or demonstrate the basic pattern.

**Run**:
```bash
node test-minimal.mjs
```

**Example Output**:
```
SUCCESS: Agent SDK responded without requiring authentication setup first
```

---

### 3. test-standalone.mjs
**Simulates fresh environment** by clearing all auth-related environment variables.

**Features**:
- Deletes CLAUDE_CODE_SESSION_ID, CLAUDE_API_KEY, ANTHROPIC_API_KEY
- Tests SDK behavior in completely clean environment
- Verifies SDK error messages for missing auth

**Use when**: You need to **test SDK behavior from scratch** without existing credentials.

**Run**:
```bash
node test-standalone.mjs
```

---

## Quick Comparison

| Test | Lines | Diagnostics | Use Case |
|------|-------|-------------|----------|
| **comprehensive** | 143 | ✅ Full environment checks | Debugging auth issues |
| **minimal** | 38 | ❌ None | Quick verification |
| **standalone** | ~40 | ⚠️ Environment simulation | Fresh environment testing |

---

## Core Pattern (Used by All)

All tests use the same fundamental approach:

```javascript
import { query } from '@anthropic-ai/claude-agent-sdk';

try {
  for await (const message of query({
    prompt: "test message",
    options: { maxTurns: 1 }
  })) {
    console.log("✅ Authentication working");
    break;
  }
} catch (error) {
  if (error.message.includes('auth')) {
    console.log("❌ Authentication required");
  }
}
```

---

## What These Tests DON'T Cover

These tests verify **initialization layer** (authentication), NOT **event loop capabilities**:

### Not Tested
- ❌ Multi-turn conversations (session persistence)
- ❌ Tool execution (custom tools)
- ❌ Streaming response handling (block-by-block)
- ❌ Session resumption (`resume` parameter)
- ❌ Custom hooks (BMAD quality gates)
- ❌ Multi-user isolation

### Why?
All tests use `query()` wrapper (stateless, one-shot) instead of `ClaudeSDKClient` (stateful, multi-turn).

**For event loop documentation**: See `docs/planning/agent-event-loop/`

---

## Architectural Context

```
┌─────────────────────────────────────┐
│   User Input Layer                  │
│   (CLI, HTTP, Telegram)             │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Initialization Layer              │  ← THESE TESTS VERIFY THIS
│   (Authentication Check)            │
│   - ANTHROPIC_API_KEY?              │
│   - ~/.claude/session-env?          │
│   - Error if missing                │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Agent Event Loop Layer            │  ← NOT TESTED
│   (ClaudeSDKClient)                 │
│   - Session management              │
│   - Multi-turn conversations        │
│   - Tool execution                  │
│   - Streaming responses             │
└─────────────────────────────────────┘
```

---

## Setup

**Dependencies**:
```bash
npm install @anthropic-ai/claude-agent-sdk
```

**Authentication Options**:

1. **API Key** (environment variable):
```bash
export ANTHROPIC_API_KEY="sk-ant-..."
```

2. **Claude CLI** (OAuth):
```bash
claude auth login
```

---

## Key Findings

1. ✅ **Authentication is required** before SDK usage
2. ✅ **Two auth sources work**: ANTHROPIC_API_KEY or ~/.claude/session-env
3. ✅ **SDK errors clearly** when auth is missing
4. ✅ **Story order confirmed**: Story 2.4 (Configure Auth) → Story 2.5 (Integrate SDK)

---

## Recommendations

### During Development
- Use **test-comprehensive.mjs** when debugging auth issues
- Use **test-minimal.mjs** for quick checks
- Use **test-standalone.mjs** to verify clean-environment behavior

### For Documentation
- **test-minimal.mjs** provides the clearest code example
- **test-comprehensive.mjs** shows production-ready error handling

### For Future Work
- These patterns can be extracted into reusable auth verification utilities
- Consider adding similar tests for other initialization concerns (file permissions, working directory, etc.)

---

**Created**: 2024-11-13
**Status**: Spike complete - Authentication requirement confirmed
