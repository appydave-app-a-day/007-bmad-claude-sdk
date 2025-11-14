# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 🚧 PROJECT STATE: PRE-IMPLEMENTATION

**IMPORTANT: No application code exists yet. This repository is ready for BMAD Method execution.**

### What Currently Exists
- ✅ Planning documents in `docs/planning/` (high-level reference only)
- ✅ Execution guide with pre-answered questions (`docs/planning/bmad-execution-guide.md`)

### What Does NOT Exist Yet
- ❌ No `bmad/` folder (BMAD not installed)
- ❌ No application code (`server.ts`, `package.json`, etc.)
- ❌ No BMAD artifacts (PRD, tech-spec, stories)

### Your Next Step
**Install BMAD Method v4 and execute the workflow** to generate all project artifacts.

```bash
npx bmad-method install
```

**Then follow the workflow in `action-plan.md`**

---

## 🎯 Project Goal

Build a **self-editing web application** powered by Claude Agent SDK and disciplined by BMAD Method:

- User types in text box → app generates data/UI for itself
- ~200 lines of framework code (custom tools + Express + React)
- BMAD quality gates enforce story-driven development
- Educational demo of Claude Agent SDK + BMAD integration

**High-level reference**: See `docs/planning/project-reference.md` for complete vision

---

## 🔄 BMAD Method Workflow (PRIMARY PATH)

This is a **BMAD Method v4 project**. All development happens through the BMAD workflow.

### Step 1: Install BMAD Method

```bash
npx bmad-method install
```

This creates the `bmad/bmm/` structure with agents, workflows, and output folders.

### Step 2: Initialize Project (`*workflow-init`)

Run the workflow initialization to set up project context:

```bash
*workflow-init
```

**Pre-answered questions** (from `docs/planning/bmad-execution-guide.md`):
- **Project name**: "BMAD + Claude SDK Self-Editing App"
- **What are you building**: Self-editing web app with Express + React + Claude SDK
- **Track selection**: Quick Flow (implementation-focused, not strategic planning)

**Output**: `bmad/bmm/output/bmm-workflow-status.yaml`

### Step 3: Create Tech-Spec (`*tech-spec`)

Generate technical specification with PM agent (John):

```bash
*tech-spec
```

**Reference materials** to provide:
- `docs/planning/project-reference.md` - Complete specification
- `docs/planning/tech-stack.md` - Technology decisions
- `docs/planning/video-strategy.md` - Epic structure (3 epics)

**Optional: YOLO Mode** for fast execution:
```bash
*yolo
*tech-spec
```

**Output**: `bmad/bmm/output/tech-spec.md` with ~10-13 stories across 3 epics

### Step 4: Check Workflow Status

```bash
*workflow-status
```

Shows current phase, completed artifacts, and next steps.

### Step 5: Implementation

Once tech-spec is complete:
1. Set `bmad/bmm/stories/ACTIVE_STORY.md`
2. Implement stories using Claude Code
3. BMAD hooks enforce quality gates (active story requirement)

**Detailed walkthrough**: See `action-plan.md` for complete video demonstration script

---

## 🏗️ What We're Building

### Three Epics (Generated via BMAD tech-spec)

**Epic 1: Monorepo Setup with Basic Server & Client**
- NPM workspaces (root, server, client, shared)
- Express + TypeScript server
- Basic HTML page with text box
- Success: Form submission → server response

**Epic 2: Claude Agent SDK Integration**
- Claude SDK event loop integration
- 3 custom tools: `read_json`, `write_json`, `write_file`
- BMAD quality gate hooks
- Socket.io streaming
- Success: Claude SDK responds with real-time streaming

**Epic 3: React Frontend with Chat Interface**
- React + Vite + TypeScript
- shadcn/ui + Vercel AI Elements
- Socket.io client
- Success: Production-ready chat UI with streaming

### Technology Stack

**Monorepo**: NPM Workspaces (proven pattern from Storyline App)

**Server**:
- Express 5 + TypeScript
- Claude Agent SDK (event loop)
- Socket.io server (streaming)
- Custom tools (domain-agnostic file operations)

**Client**:
- React 19 + TypeScript
- Vite 7 (build tool)
- shadcn/ui (base components)
- Vercel AI Elements (chat UI)
- Socket.io-client (streaming)
- TailwindCSS 4

**Authentication**: Claude CLI OAuth (`claude auth login` - no API key needed)

**See**: `docs/planning/tech-stack.md` for complete technology reference

---

## 🔑 Key Implementation Concepts

### Three Custom Tools (Domain-Agnostic)

```typescript
// Tool 1: Read JSON from /data directory
read_json(filepath)

// Tool 2: Write/update JSON in /data directory
write_json(filepath, content)

// Tool 3: Create/update HTML/CSS/JS in /public directory
write_file(filepath, content)
```

These tools are **generic** - they don't know about "products" or "blogs". The application evolves based on user conversation.

### BMAD Quality Gate Hook

Before allowing file writes, verify active story exists:

```typescript
const hooks = {
  async beforeToolCall(ctx) {
    if (ctx.toolName === 'write_file') {
      const active = 'bmad/bmm/stories/ACTIVE_STORY.md';
      await fs.access(active); // Throws if missing
    }
  }
};
```

### Path Sandboxing

Only allow writes to safe directories:

```typescript
const safe = (p) => {
  const full = path.resolve(p);
  if (!full.startsWith(PUBLIC_DIR) && !full.startsWith(DATA_DIR)) {
    throw new Error('Blocked: only /public and /data writable');
  }
  return full;
};
```

**See**: `docs/planning/project-reference.md` (lines 243-268) for complete implementation examples

---

## 📚 Planning Documentation (Reference Only)

The `docs/planning/` folder contains supporting documentation created during planning phase. These are **reference materials** for BMAD agents when they ask questions.

**Key files**:
- `project-reference.md` - Complete specification and architecture
- `tech-stack.md` - Technology decisions with rationale
- `video-strategy.md` - Epic structure (3 epics)
- `bmad-execution-guide.md` - Pre-answered questions for workflow
- `action-plan.md` - Complete video demonstration script

**When to use**: Provide these files to BMAD agents (Mary, John) when they ask for project context during workflow execution.

**Don't start here**: These are inputs to BMAD, not the workflow itself. Start with `npx bmad-method install` instead.

---

## 📖 External References

### BMAD Method v4

**Installation**:
```bash
npx bmad-method install
```

**Repository**: https://github.com/bmad-code-org/BMAD-METHOD/

**What it provides**:
- Workflow initialization (`*workflow-init`)
- Tech-spec generation (`*tech-spec`)
- Story-driven development structure
- Quality gates and hooks
- Workflow status tracking (`*workflow-status`)

**Curated documentation**: `/Users/davidcruwys/dev/ad/brains/bmad-method/`

### Claude Agent SDK

**Purpose**: Powers the self-editing application runtime

**npm**: `@anthropic-ai/claude-agent-sdk`

**Key features**:
- Event-driven agent loop
- Custom tool integration
- System prompt configuration
- Streaming responses
- Quality gate hooks

**Curated documentation**: `/Users/davidcruwys/dev/ad/brains/anthropic-claude/agent-sdk/`

**Source code**: `/Users/davidcruwys/dev/js_3rd/claude-agent-sdk-typescript/`

### Authentication

```bash
claude auth login  # One-time OAuth setup
```

No API key needed - uses Claude Pro/Team subscription via OAuth.

---

## ✅ Success Criteria

**After BMAD workflow execution**:
- ✅ `bmad/bmm/` folder structure exists
- ✅ `bmad/bmm/output/tech-spec.md` with ~10-13 stories
- ✅ Stories organized across 3 epics
- ✅ Ready for implementation with `ACTIVE_STORY.md`

**After implementation**:
- ✅ ~200 lines of framework code (server + custom tools)
- ✅ BMAD quality gates enforced (active story requirement)
- ✅ React chat interface with streaming responses
- ✅ Application can self-edit through conversation

---

**Last Updated**: 2025-11-14
**Status**: PRE-IMPLEMENTATION - Ready for BMAD workflow execution
