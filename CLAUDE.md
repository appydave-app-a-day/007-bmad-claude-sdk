# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 🚧 PROJECT STATE: PRE-IMPLEMENTATION (Video Planning Phase)

**IMPORTANT: No application code exists yet. This is a planning repository for a video tutorial.**

### What Currently Exists
- ✅ **7 planning documents** in `docs/planning/` (with YAML front matter)
- ✅ **Claude Agent SDK implementation guide** in `docs/planning/agent-event-loop/`
- ✅ **Video strategy** and **demo sequence** documentation
- ✅ **Future goals** in `docs/planning/future/` (SKILLS, security deep-dive)

### What Does NOT Exist Yet
- ❌ No `server.ts`, `package.json`, or application code
- ❌ No `bmad/` folder structure (BMAD hasn't run yet)
- ❌ No implemented features or working application

### Current Phase
**Creating planning documents** that will be used to:
1. **Script a video tutorial** about building self-editing applications
2. **Generate BMAD artifacts** (PRD, architecture, stories)
3. **Then build the actual application** using BMAD Method + Claude Agent SDK

**→ If you're trying to work with application code, it doesn't exist yet. Start with BMAD installation first.**

---

## 📁 Current File Structure

```
007-bmad-claude-sdk/
├── CLAUDE.md                          # This file
├── README.md                          # Public project overview
├── action-plan.md                     # Video recording workflow
├── PROBLEM-DEFINITION.md              # Epic 2 story order research
└── docs/
    └── planning/
        ├── project-reference.md       # Master specification
        ├── video-strategy.md          # Video narrative with epic structure
        ├── visual-concepts.md         # Architecture diagrams
        ├── tech-stack.md              # Technology stack reference
        ├── demo-sequence.md           # Post-BMAD demonstration flow
        ├── system-prompt.md           # Agent configuration
        ├── security.md                # Security considerations
        ├── agent-instructions.md      # Planning doc review agent
        ├── agent-event-loop/          # SDK implementation guide
        │   ├── readme.md
        │   ├── overview.md
        │   ├── core-loop.md
        │   ├── dsl-reference.md
        │   └── sdk-summary.md
        ├── backlog/                   # Future content (V2+)
        │   ├── skills-design.md
        │   └── youtube-title-thumbnail.md
        └── spike/                     # Code spike artifacts
```

**Quick Guide to Planning Docs (V1):**
- **Start here**: `docs/planning/project-reference.md` - Complete specification
- **Video creation**: `action-plan.md` → `docs/planning/video-strategy.md`
- **Tech stack**: `docs/planning/tech-stack.md` - Technology decisions for BMAD agents
- **Implementation**: `docs/planning/agent-event-loop/` - SDK implementation guide
- **Demo**: `docs/planning/demo-sequence.md` - Post-BMAD demonstration flow
- **Security**: `docs/planning/security.md` - Brief security overview

**Backlog (V2+):**
- `docs/planning/backlog/skills-design.md` - Claude SKILLS integration
- `docs/planning/backlog/youtube-title-thumbnail.md` - Marketing (deferred)

---

## 🎯 Project Vision (What We WILL Build)

**Project**: BMAD + Claude Agent SDK - Self-Editing Application Framework
**App-a-Day**: #007
**Educational Goal**: Demonstrate how to integrate Claude Agent SDK with BMAD Method

### The Concept
A self-editing web application that modifies itself through conversational AI:
- Starts with just a text box
- User types conversational requests
- Application creates its own data structures (products.json, blog.json)
- Application generates its own pages (list views, detail views)
- Application validates its own code quality
- Application documents its own evolution

**Key Insight**: ONE application that edits and extends itself through conversation (not a framework that builds separate apps).

### Core Implementation Target
- ~200 lines of code (backend framework)
- 3 custom tools: `read_json`, `write_json`, `write_file`
- Express server with `/chat` endpoint
- BMAD quality gate hooks
- Sandboxed file operations

### Technology Stack (Future)
- **Backend**: TypeScript, Express, Claude Agent SDK
- **Frontend**: Static HTML, Tailwind CSS, Vanilla JavaScript
- **Auth**: Claude CLI OAuth (no API key needed)
- **Development**: BMAD Method v4 for planning and quality gates

---

## 🔄 Next Steps: BMAD Method Workflow

### When You're Ready to Build

**Follow the action-plan.md for the complete video workflow:**

**1. Initialize BMAD Project**
```bash
# Load workflow-init command
*workflow-init
```
- Answer questions about project type
- Select "Quick Flow" track (tech-spec without full PRD)
- Reference existing planning docs in `docs/planning/`

**2. Check Workflow Status**
```bash
*workflow-status
```
- Shows current phase and recommended next steps
- Acts as your compass through BMAD workflow

**3. BMAD Analysis Phase**
```bash
# Load analyst agent
Load bmad/bmm/agents/analyst.md

# Create product brief from planning docs
```
- Synthesize `docs/planning/*.md` into BMAD product brief
- Focus on self-editing capability, security constraints, BMAD integration

**4. BMAD Planning Phase** (Quick Flow Track)
```bash
# Load architect agent
Load bmad/bmm/agents/architect.md

# Generate tech-spec
```
- Create technical specification for the application
- Define Express server architecture
- Specify 3 custom tools (read_json, write_json, write_file)
- Document sandboxing approach

**5. Implementation Phase**
Once BMAD artifacts exist:
- Set `ACTIVE_STORY.md`
- Create `server.ts` with Express + Claude Agent SDK
- Create `public/index.html` with conversational interface
- Implement 3 custom tools
- Add BMAD quality gate hooks

**6. Demo Phase (The Magic)**
- Leave VSCode
- Open browser to `http://localhost:3000`
- Through conversation, application builds itself:
  - "Create 3 products" → generates data/products.json
  - "Make a product listing page" → generates public/products.html
  - "Add a blog" → generates blog system
  - Progressive feature addition through conversation

---

## 📚 Planning Documentation Reference

### For Video Creation
Read in this order:
1. `docs/planning/video-strategy.md` - Narrative structure and flow
2. `docs/planning/visual-concepts.md` - Visual design and B-roll concepts
3. `docs/planning/youtube-title-thumbnail.md` - Marketing and presentation

### For Technical Understanding
Read in this order:
1. `docs/planning/project-reference.md` - Complete specification
2. `docs/planning/skills-design.md` - Custom Skills design (A/B UI Generator, BMAD Story Generator)
3. `docs/planning/system-prompt.md` - Agent prompt evolution and design decisions
4. `docs/planning/security-considerations.md` - Attack vectors and mitigations

### For Content Processing
- `docs/planning/agent-instructions.md` - How to process research and create documentation

---

## ⚠️ Security Considerations (Future Implementation)

**This will be an educational demo of a self-modifying application.**

**Safe for:**
- ✅ Local development and learning
- ✅ Internal tools with trusted users
- ✅ Rapid prototyping and MVPs

**Dangerous for:**
- ❌ Production without significant hardening
- ❌ Public-facing applications
- ❌ Systems with untrusted user input
- ❌ Applications handling sensitive data

**Risks**: Prompt injection, code injection, path traversal, resource exhaustion

**See**: `docs/planning/security-considerations.md` for full details

---

## 🎬 Video Narrative (The Plan)

1. **Introduction**: BMAD + Claude SDK = self-editing applications
2. **Phase 1 (Planning)**: Use BMAD to plan the framework
3. **Phase 2 (Building)**: Code the 200-line core with BMAD discipline
4. **Phase 3 (The Pivot)**: Leave VSCode, open browser, use text box
5. **Demo**: Application adds features to itself through conversation
6. **Progressive BMAD**: Manual → automatic → self-validating evolution
7. **Conclusion**: Recursive BMAD demonstration

**Target**: ~36-minute video
**Paradigm**: Context Engineering (BMAD) + Vibe Coding (SDK runtime)

---

## 🔑 Key Concepts (For Future Implementation)

### Three-Layer Architecture
```
Frontend (Static HTML + JavaScript)
  ↓ HTTP POST /chat
Backend (Express + Claude Agent SDK)
  ↓ File I/O via custom tools
Data Layer (/data/*.json, /public/*.html)
```

### Three Custom Tools
1. `read_json(filepath)` - Read any JSON from `/data`
2. `write_json(filepath, content)` - Create or update JSON in `/data`
3. `write_file(filepath, content)` - Create or update HTML/CSS/JS in `/public`

### Tool Safety (Sandboxing)
```typescript
const safe = (p) => {
  const full = path.resolve(p);
  if (!full.startsWith(PUBLIC_DIR) && !full.startsWith(DATA_DIR)) {
    throw new Error('Blocked: only /public and /data writable');
  }
  return full;
};
```

### BMAD Quality Gate Hook
```typescript
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

### Authentication
```bash
claude auth login  # One-time OAuth setup (no API key needed)
```

---

## 📖 Reference Documentation

### Claude Technologies

**Second Brain (Curated Docs)**: `/Users/davidcruwys/dev/ad/brains/anthropic-claude/`

This project uses three Claude technologies with curated documentation:

1. **Claude Agent SDK** → [Agent SDK Index](../../brains/anthropic-claude/agent-sdk/INDEX.md)
   - **Purpose**: Building the self-editing application runtime
   - **Key docs**:
     - [Agent Fundamentals](../../brains/anthropic-claude/agent-sdk/agent-fundamentals.md) - Core concepts, agent loop, ACI design
     - [SDK Technical Patterns](../../brains/anthropic-claude/agent-sdk/sdk-technical-patterns.md) - System prompts, streaming, auth, MCP
     - [SDK Practical Examples](../../brains/anthropic-claude/agent-sdk/sdk-practical-examples.md) - Code examples, Mini Shop Demo
   - **Source code**: `/Users/davidcruwys/dev/js_3rd/claude-agent-sdk-typescript/`

2. **Claude Code CLI** → [Claude Code Docs](../../brains/anthropic-claude/claude-code/)
   - **Purpose**: Used during BMAD Analysis/Planning phases
   - **Source code**: `/Users/davidcruwys/dev/js_3rd/claude-code/`

3. **Claude Skills** → [Skills Overview](../../brains/anthropic-claude/skills/overview.md)
   - **Purpose**: A/B UI Generator and BMAD Story Generator (video demonstration)
   - **Source code**: `/Users/davidcruwys/dev/js_3rd/anthropic-skills/`

**When implementing**: Start with SDK Practical Examples → reference Technical Patterns as needed

---

### BMAD Method v8 Alpha

**Source Code**: `/Users/davidcruwys/dev/js_3rd/BMAD-METHOD` (v8 alpha - latest)

**Documentation**: `/Users/davidcruwys/dev/ad/brains/bmad-method/` (curated guidance)

**What it provides**:
- Analysis → Planning → Solutioning → Implementation workflow
- PRD and architecture generation
- Story-driven development structure
- Quality gates and hooks

**Installation**:
```bash
npx bmad-method install
```

**Reference when**:
- Generating BMAD artifacts tomorrow
- Understanding BMAD v8 workflow changes
- Troubleshooting BMAD CLI issues

---

## ✅ Success Criteria (Future Implementation)

### Code Quality
- Backend under 200 lines
- Generic tools (no domain knowledge)
- Type-safe TypeScript
- Clean separation of concerns

### BMAD Alignment
- PRD defines self-editing application (not specific features)
- Stories guide framework development
- Active story enforced by hooks
- Application can update its own PRD
- Code quality validation using Claude Code agent

### Demo Value
- Shows self-editing application in action
- Demonstrates progressive BMAD enhancement
- Application validates and documents itself
- Works for any domain (products, blog, etc.)
- BMAD discipline maintained recursively

---

## 🚀 When You're Ready to Start

**Current Phase**: Planning and video strategy complete
**Next Action**: Install BMAD Method and begin Analysis phase
**Command**: `npx bmad-method install`
**Input**: Use `docs/planning/project-reference.md` as specification
**Output**: BMAD artifacts in `bmad/bmm/` structure
**Then**: Implement the application using BMAD stories

---

---

## 📝 Key Documentation Files

### action-plan.md
Complete step-by-step video recording script for demonstrating BMAD v6-alpha workflow. Includes:
- Pre-recording checklist
- Phase-by-phase walkthrough (Init → Analysis → Planning → Implementation → Demo)
- Exact commands and prompts to use
- What to say during video recording
- Expected outputs at each step

**Use this when**: Recording the tutorial video or following BMAD workflow for the first time

### PROBLEM-DEFINITION.md
Research artifact investigating authentication flow for Claude Agent SDK. Captures:
- Story order question: Does auth (Story 2.4) come before or after SDK integration (Story 2.5)?
- User experience options: Prerequisites-first vs Discovery flow
- SDK capabilities vs Claude Code capabilities
- Testing challenges (environment contamination)

**Use this when**: Understanding authentication setup requirements or Epic 2 planning decisions

### docs/planning/agent-sdk-capabilities.md
Complete capability matrix of Claude Agent SDK event loop (independent of transport layer). Documents:
- Configuration capabilities (cwd, system prompt, tools, MCP servers)
- Execution capabilities (streaming, tool execution, multi-turn reasoning)
- Session management (persistence, context retention)
- Metadata tracking (tokens, cost, duration)
- What SDK provides vs what you must implement

**Use this when**: Understanding SDK internals, designing custom tools, or comparing transport layers

---

**Last Updated**: 2025-11-13
**Status**: PRE-IMPLEMENTATION - Planning documents complete, action plan ready, awaiting BMAD workflow execution
