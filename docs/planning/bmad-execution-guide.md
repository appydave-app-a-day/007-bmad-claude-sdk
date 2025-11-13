---
title: BMAD Execution Guide
purpose: Step-by-step guide for executing BMAD workflow with pre-answered questions
audience: Video demonstration, implementation execution
when_to_read: When ready to run BMAD workflow to generate PRD and tech-spec
key_sections: [Workflow Init Answers, Tech-Spec Questions, YOLO Mode]
status: active
---

# BMAD Execution Guide

**Purpose**: Pre-answered guide for Mary (Analyst) workflow execution in video demonstration.

---

## Overview

**Workflow Path**: Quick Flow (Greenfield)
**Agents Used**: Mary (Analyst) → PM (John) for tech-spec
**Output**: Tech-spec with stories

**Why Quick Flow?**
- Project scope is clear (self-editing app framework)
- We have comprehensive planning docs already
- Goal is implementation-focused (not strategic product planning)
- Fast path: Hours not days

---

## Step 1: workflow-init (Mary)

### Command
```
Load Mary (Analyst)
*workflow-init
```

### Mary's Questions and Our Answers

#### Q1: "What's your project called?"
**Answer**: `BMAD + Claude SDK Self-Editing App`

#### Q2: Project State Detection
**Mary will find**: Clean slate (no artifacts, no code yet)
**Mary says**: "Perfect! This looks like a fresh start."
**No action needed** - she continues automatically

#### Q3: "Tell me about what you're working on. What's the goal?"
**Answer**:
```
Build a self-editing web application using Claude Agent SDK integrated with BMAD quality gates.

The app is a monorepo (NPM workspaces) with:
- Express + TypeScript server with Claude SDK
- React + Vite client with chat interface
- Socket.io for real-time streaming
- 3 custom tools (read_json, write_json, write_file)
- BMAD hooks for quality enforcement

Users type conversational requests in a text box and the application modifies its own data structures and UI pages in real-time.
```

**Mary detects**: Greenfield (new project, no existing code)

#### Q4: Optional Discovery Workflows
**Mary asks**: "Would you like to:
- 🧠 Brainstorm your project?
- 🔍 Research your domain?

Your choice: a/b/c/d"

**Answer**: `d` (No, I'm ready to plan)

**Why skip?** We already have comprehensive planning docs (project-reference.md, tech-stack.md, etc.)

#### Q5: Track Selection
**Mary presents 3 tracks**:
1. BMad Quick Flow - Fast, tech-spec focused
2. BMad Method - Full PRD + Architecture
3. BMad Enterprise Method - Extended enterprise planning

**Mary's recommendation**: Likely recommends "Quick Flow" based on our clear scope

**Answer**: `1` (BMad Quick Flow)

**Why Quick Flow?**
- We have detailed planning already (not discovery phase)
- Scope is crystal clear (3 epics, tech stack defined)
- Implementation-focused (want to start coding)
- No strategic ambiguity requiring full PRD

#### Workflow Init Complete
**Mary outputs**: `bmad/bmm/output/bmm-workflow-status.yaml`
**Status**: Quick Flow track selected, ready for tech-spec creation

---

## Step 2: tech-spec (PM - John)

### Command
```
Load PM (John)
*tech-spec
```

### PM's Questions and Our Answers

**Source docs to reference**:
- `docs/planning/project-reference.md` - Complete specification
- `docs/planning/tech-stack.md` - Technology decisions
- `docs/planning/video-strategy.md` - Epic structure

#### Tech-Spec Section 1: Project Overview

**PM asks**: "What are we building?"

**Answer** (from project-reference.md):
```
Self-editing web application powered by Claude Agent SDK

**User Experience**:
User types in text box → app generates data structures → app creates UI pages

**Technical Foundation**:
- Monorepo: NPM workspaces (root, server, client, shared)
- Backend: Express + TypeScript + Claude Agent SDK + Socket.io
- Frontend: React + Vite + shadcn/ui + Vercel AI Elements
- 3 custom tools: read_json, write_json, write_file
- BMAD quality gates via hooks
- Path sandboxing (/data and /public only)

**Key Concept**: ONE application that modifies itself through conversation
```

#### Tech-Spec Section 2: Technical Stack

**PM asks**: "What's your technology stack?"

**Answer** (from tech-stack.md):
```
Monorepo Structure:
- NPM Workspaces (proven in Storyline App)
- Structure: root, server, client, shared

Server:
- Express 5 + TypeScript
- Claude Agent SDK (event loop)
- Socket.io server (streaming)
- Custom tools: read_json, write_json, write_file

Client:
- React 19 + TypeScript
- Vite 7 (build tool)
- shadcn/ui (base components)
- Vercel AI Elements (chat UI)
- Socket.io-client (streaming)
- TailwindCSS 4

Real-time Communication:
- Socket.io bidirectional
- Claude SDK streams → Socket.io → React UI
```

#### Tech-Spec Section 3: Epic Breakdown

**PM asks**: "What are the major features/epics?"

**Answer** (from video-strategy.md):
```
Epic 1: Monorepo Setup with Basic Server & Client
- NPM workspaces configuration
- Express + TypeScript server
- Basic HTML page with text box
- Form submission → server response
Success: Type in text box, see server response

Epic 2: Claude Agent SDK Integration
- Claude SDK event loop
- Custom tools (read_json, write_json, write_file)
- BMAD quality gate hooks
- Socket.io for streaming
- Text box → SDK → streaming response
Success: Claude SDK responds with real-time streaming

Epic 3: React Frontend with Chat Interface
- Replace basic HTML with React + Vite
- shadcn/ui + Vercel AI Elements integration
- Socket.io client connection
- Professional chat interface
Success: Production-ready chat UI with streaming
```

#### Tech-Spec Section 4: Architecture

**PM asks**: "Describe the architecture"

**Answer** (from project-reference.md):
```
Three-Layer System:

Frontend (React + Vite)
  - Chat interface (Vercel AI Elements)
  - Real-time streaming display
  - Socket.io client connection
        ↓ Socket.io
Backend (Express + Agent SDK)
  - POST /chat endpoint
  - Socket.io server (streaming)
  - Claude Agent with custom tools
  - Static client asset serving
        ↓ File I/O
Data Layer
  - /data/*.json (generated data)
  - /public/*.html (generated pages)

Security: Path sandboxing - only /data and /public writable
```

#### Tech-Spec Section 5: Stories

**PM will auto-generate stories from epic descriptions**

Expected stories (PM creates these):
- **Epic 1 stories**: ~3-4 stories (workspace setup, server, client, integration)
- **Epic 2 stories**: ~4-5 stories (SDK integration, tools, hooks, Socket.io)
- **Epic 3 stories**: ~3-4 stories (React setup, shadcn, AI Elements, Socket.io client)

**Total**: ~10-13 stories

**PM asks for each story**: "Does this look right?" → Answer `y` or provide corrections

---

## YOLO Mode (Optional)

**What is YOLO Mode?**
- Skips elicitation prompts (1-9 question format)
- Fast execution for demos
- Still generates complete documents
- Just doesn't stop for interactive refinement

**To enable**:
```
PM: *yolo
[Toggle on]
PM: *tech-spec
[Runs without stopping for elicitation questions]
```

**When to use**:
- Video demonstration (keep flow moving)
- When planning docs are comprehensive (like ours)
- Trust the agent to generate from context

**When NOT to use**:
- Vague requirements
- Need interactive refinement
- Learning/exploration phase

---

## Success Criteria

**After tech-spec completion**, you should have:

1. ✅ `bmad/bmm/output/tech-spec.md` - Complete technical specification
2. ✅ Epic structure matching our 3 epics
3. ✅ ~10-13 stories ready for implementation
4. ✅ Technology stack documented
5. ✅ Architecture clearly defined

**Next step**: Sprint planning with Bob (SM) to organize stories for implementation

---

## Troubleshooting

**If PM asks for information we don't have**:
- Reference the planning docs (`docs/planning/`)
- Use project-reference.md as primary source
- Tech-stack.md for all technology decisions
- Video-strategy.md for epic structure

**If PM wants more detail than we've planned**:
- Answer with "Defer to implementation" for minor details
- Focus on high-level decisions (stack, architecture, epics)
- Remember: Quick Flow is implementation-focused, not comprehensive planning

**If stories don't match our epic structure**:
- Correct PM and reference video-strategy.md epic breakdown
- Ensure 3 epics, not more or less
- Each epic should have clear success criteria

---

## Notes for Video Demonstration

**Pacing**:
- workflow-init: ~2 minutes (quick answers, no exploration)
- tech-spec: ~10-15 minutes (with YOLO: ~5 minutes)
- Show the generated files briefly
- Emphasize the value: "AI now has complete context"

**Key talking points**:
- "We're using Quick Flow because our scope is clear"
- "These planning docs become the AI's context"
- "BMAD structure keeps quality high while moving fast"
- "Now we have stories ready for implementation"

**Show vs Tell**:
- SHOW: The workflow-status.yaml output
- SHOW: The generated tech-spec.md
- TELL: How this integrates with Claude Code for implementation
- TELL: How BMAD hooks will enforce quality gates

---

**Last Updated**: 2025-11-13
**Status**: Ready for video execution
