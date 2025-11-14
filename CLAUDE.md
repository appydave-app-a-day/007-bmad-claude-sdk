# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 📖 Quick Reference: Document Hierarchy

**PRIMARY SOURCES** (start here for all implementation):
1. `docs/brief.md` - Complete project specification (564 lines)
2. `docs/prd.md` - 14 stories across 3 epics with acceptance criteria (646 lines)

**SUPPLEMENTARY** (for specific details):
3. `docs/planning/` - Detailed specifications, tech rationale, demo sequences

**Read this file** for: Project state, epic overview, requirements summary, external resources

---

## 🚧 PROJECT STATE: BMAD ARTIFACTS COMPLETE, READY FOR IMPLEMENTATION

**IMPORTANT: BMAD-generated brief and PRD are complete. No application code exists yet.**

### What Currently Exists
- ✅ **Project Brief** (`docs/brief.md`) - Complete project specification by Mary (Business Analyst) ⭐ PRIMARY
- ✅ **PRD** (`docs/prd.md`) - Full requirements with 3 epics, 14 stories by John (PM) ⭐ PRIMARY
- ✅ Planning documents in `docs/planning/` (supplementary reference for specific details)

### What Does NOT Exist Yet
- ❌ No application code (`packages/`, `server.ts`, `package.json`, etc.)
- ❌ No architecture document yet (next step: Architect agent)

### Your Next Step
**Run Architect agent to create `docs/architecture.md`** or begin implementation of Epic 1 stories.

---

## 🎯 Project Goal

Build a **self-editing web application** powered by Claude Agent SDK and disciplined by BMAD Method:

- User types in text box → app generates data/UI for itself
- ~200 lines of framework code (custom tools + Express + React)
- BMAD quality gates enforce story-driven development
- Educational demo of Claude Agent SDK + BMAD integration

**Primary reference**: See `docs/brief.md` and `docs/prd.md` for complete specifications ⭐

**Supplementary details**: `docs/planning/` folder contains supporting documentation

---

## 📋 Project Documentation Hierarchy

### Primary Sources (START HERE)

1. **`docs/brief.md`** ⭐ - Project Brief by Mary (Business Analyst)
   - Executive summary, problem statement, proposed solution
   - Target users, goals, success metrics
   - MVP scope, post-MVP vision
   - Technical considerations, constraints, risks
   - Complete project context in one place

2. **`docs/prd.md`** ⭐ - Product Requirements Document by John (PM)
   - 14 stories across 3 epics with acceptance criteria
   - Functional requirements (FR1-FR10)
   - Non-functional requirements (NFR1-NFR7)
   - UI design goals, technical assumptions
   - Complete implementation roadmap

### Supplementary References

3. **`docs/planning/`** - Detailed planning documents
   - `project-reference.md` - Original detailed specification
   - `tech-stack.md` - Technology decisions with rationale
   - `video-strategy.md` - Epic structure and narrative
   - `demo-sequence.md` - Step-by-step demonstration flow
   - `bmad-execution-guide.md` - BMAD workflow walkthrough

   **Use when**: You need specific implementation details, technology rationale, or demo sequences that aren't in the brief/PRD

---

## 🔄 Current Development Phase

### Completed BMAD Artifacts
- ✅ Project Brief (`docs/brief.md`) - 564 lines
- ✅ PRD (`docs/prd.md`) - 14 stories across 3 epics

### Next Steps
1. **Architecture Document**: Run Architect agent to create `docs/architecture.md`
2. **Implementation**: Begin Epic 1 Story 1.1 (Initialize NPM Workspaces Monorepo)

### Implementation Workflow
Once architecture is complete:
1. Read story acceptance criteria from `docs/prd.md`
2. Implement story code
3. Verify all acceptance criteria met
4. Move to next story

---

## 🏗️ What We're Building (From PRD)

### Three Epics - 14 Stories Total

**Epic 1: Monorepo Setup with Basic Server & Client** (4 stories)
- Story 1.1: Initialize NPM Workspaces Monorepo
- Story 1.2: Create Express TypeScript Server
- Story 1.3: Create Basic HTML Client
- Story 1.4: Implement Socket.io for Real-Time Communication
- **Goal**: Prove bidirectional communication works before Agent SDK complexity

**Epic 2: Claude Agent SDK Integration** (6 stories)
- Story 2.1: Install and Configure Claude Agent SDK
- Story 2.2: Create Basic Agent Event Loop (no streaming, no tools)
- Story 2.3: Add Response Streaming to Event Loop
- Story 2.4: Implement Custom Tool: `read_json`
- Story 2.5: Implement Custom Tool: `write_json`
- Story 2.6: Implement Custom Tool: `write_file`
- **Goal**: Incremental Agent SDK integration with three domain-agnostic tools

**Epic 3: React Frontend with Chat Interface** (4 stories)
- Story 3.1: Initialize React + Vite Application
- Story 3.2: Install shadcn/ui and Configure TailwindCSS
- Story 3.3: Build Chat Interface with Vercel AI Elements
- Story 3.4: Implement Light/Dark Mode Toggle
- **Goal**: Production-quality chat UI with streaming support

**See `docs/prd.md` for complete acceptance criteria for each story**

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

**See `docs/prd.md` (Technical Assumptions section) for complete stack details**

**See `docs/planning/tech-stack.md` for technology rationale and decision context**

---

## 🔑 Key Implementation Concepts (From Brief & PRD)

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

**See `docs/planning/project-reference.md` (lines 243-268) for detailed implementation examples**

---

## 📚 Requirements & Functional Specifications (From PRD)

### Functional Requirements (10 total)
- **FR1**: Chat interface for natural language instructions
- **FR2**: Three domain-agnostic tools (read_json, write_json, write_file)
- **FR3**: Path sandboxing (only /data and /public writable)
- **FR4**: Socket.io streaming for real-time responses
- **FR5**: NPM workspaces monorepo structure
- **FR6**: Streaming responses with markdown/code block formatting
- **FR7**: Minimal Agent SDK event loop (educational simplicity)
- **FR8**: Express serves generated HTML from /public
- **FR9**: Chat interface at /chat route
- **FR10**: Light/dark mode toggle

### Non-Functional Requirements (7 total)
- **NFR1**: Minimal Agent SDK implementation for educational clarity
- **NFR2**: Claude OAuth authentication (no API key management)
- **NFR3**: Clear console logging for educational transparency
- **NFR4**: Comprehensive inline comments for learning
- **NFR5**: Works on Node.js 18+ without cloud deployment
- **NFR6**: Desktop browser responsive (mobile not required)
- **NFR7**: Stable releases only (no experimental packages)

**See `docs/prd.md` lines 27-65 for complete FR/NFR details**

---

## 📖 External References & Resources

### BMAD-Generated Artifacts (Already Complete)

- ✅ **Project Brief**: `docs/brief.md` (generated by Mary - Business Analyst)
- ✅ **PRD**: `docs/prd.md` (generated by John - PM)
- ⏳ **Architecture**: `docs/architecture.md` (next: run Architect agent)

### BMAD Method v4 (Used to Generate Artifacts)

**Repository**: https://github.com/bmad-code-org/BMAD-METHOD/

**Curated documentation**: `/Users/davidcruwys/dev/ad/brains/bmad-method/`

**Note**: BMAD workflow already executed to produce brief and PRD. Implementation now follows story-by-story approach from PRD.

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

## ✅ Success Criteria (From Brief)

**BMAD Artifacts** (COMPLETE ✅):
- ✅ Project Brief complete (`docs/brief.md`)
- ✅ PRD with 14 stories across 3 epics (`docs/prd.md`)
- ⏳ Architecture document pending

**Implementation Goals** (From Brief - lines 225-237):
1. **Builds successfully**: `npm install && npm run dev` works in < 5 minutes
2. **Framework completeness**: ≤ 250 lines of core framework code
3. **Conversation works**: User types "create 3 products" → agent creates JSON → streams response
4. **Demo sequence completes**: Product catalog → landing page → blog → composite page
5. **Video-ready**: Complete demo fits 40-minute video format
6. **Documentation clarity**: External developer can complete walkthrough without assistance

**Key Metrics** (From Brief - lines 170-187):
- **Educational reach**: 1,000+ repository clones within 3 months
- **Time to "aha moment"**: < 60 minutes from video start to working framework
- **Video performance**: 5,000+ views, 50%+ average view duration
- **Repository engagement**: 50+ stars, 200+ unique visitors/week

---

**Last Updated**: 2025-11-14
**Status**: BMAD ARTIFACTS COMPLETE - Ready for Architecture & Implementation
