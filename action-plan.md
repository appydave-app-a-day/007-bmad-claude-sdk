# BMAD v4 Video Demo - Action Plan

**Project**: Self-Editing Claude SDK App with BMAD Integration
**BMAD Version**: v4 (stable)
**Planning Track**: Quick Flow (Greenfield)

---

## Why BMAD v4 (Not v6-alpha)

**v4 is stable and production-ready**
- v6-alpha is still experimental (alpha.9 as of 2025-11-13)
- v4 has proven workflows and predictable behavior
- Better for educational content (fewer surprises during recording)
- Clearer separation between planning and implementation phases

**v4 aligns with this project's scope**
- Quick Flow track is perfect for focused demo apps
- Simpler workflow = easier to explain in video
- Established agent personas (Mary, John, Bob, Winston, etc.)

---

## 📋 Pre-Recording Checklist

- [ ] Planning docs reviewed (docs/planning/)
- [ ] BMAD v4 installed: `npx bmad-method install`
- [ ] Verify `bmad/bmm/` folder structure created
- [ ] Test workflow commands work
- [ ] Review bmad-execution-guide.md for pre-answered questions
- [ ] Project directory clean (no old BMAD artifacts)

---

## Installation

```bash
# Install BMAD v4 (stable)
npx bmad-method install

# Verify installation
ls -la bmad/bmm/

# Expected output: agents/, workflows/, output/, config.yaml
```

**Repository**: https://github.com/bmad-code-org/BMAD-METHOD/
**Version Reference**: v6 (alpha) available at https://github.com/bmad-code-org/BMAD-METHOD/tree/v6.0.0-alpha.9

---

## 🎬 Video Recording Script

### **INTRO** (1 minute)

**On Screen**: Terminal in project root

**Say**:
> "Today I'm demonstrating the BMAD Method v4 - a structured approach to AI-assisted development. I'll show you how to take comprehensive planning documents and formalize them into executable BMAD artifacts for building a self-editing web application using Claude Agent SDK."

**Project Context**:
> "This app demonstrates Claude's self-editing capabilities - users type conversational requests in a text box, and the application modifies its own data structures and UI pages in real-time. All while maintaining BMAD quality discipline through hooks and gates."

---

### **PHASE 1: Workflow Initialization** (2-3 minutes)

**Reference**: See `docs/planning/bmad-execution-guide.md` for complete question flow

**Command**: Load Mary (Analyst)
```
*workflow-init
```

**Mary's Questions (Pre-answered)**:

1. **Project name**: "BMAD + Claude SDK Self-Editing App"

2. **Project state**: Clean slate (Mary detects automatically)

3. **What are you building?**:
```
Build a self-editing web application using Claude Agent SDK integrated with BMAD quality gates.

The app is a monorepo (NPM workspaces) with:
- Express + TypeScript server with Claude SDK
- React + Vite client with chat interface
- Socket.io for real-time streaming
- 3 custom tools (read_json, write_json, write_file)
- BMAD hooks for quality enforcement

Users type conversational requests and the app modifies itself in real-time.
```

4. **Optional discovery workflows** (brainstorm/research): `d` (No - we have planning docs)

5. **Planning track selection**: `1` (Quick Flow)

**Say While Running**:
> "workflow-init sets up our BMAD project. I'm choosing Quick Flow because our scope is crystal clear - we have comprehensive planning docs already. Quick Flow gives us a tech-spec without the overhead of full PRD and architecture documentation."

**Output**: `bmad/bmm/output/bmm-workflow-status.yaml` created

---

### **PHASE 2: Tech-Spec Creation** (10-15 minutes)

**Reference**: See `docs/planning/bmad-execution-guide.md` Section 2 for all PM questions

**Command**: Load PM (John)
```
*tech-spec
```

**Say**:
> "John is the Product Manager. In Quick Flow, he creates a focused tech-spec. I'm going to provide him with context from our planning documents."

**Key Information to Provide**:

**From project-reference.md**:
- Self-editing web application concept
- Monorepo structure (NPM workspaces)
- Three-layer architecture (Frontend → Backend → Data Layer)

**From tech-stack.md**:
- Server: Express 5 + TypeScript + Claude Agent SDK + Socket.io
- Client: React 19 + Vite + shadcn/ui + Vercel AI Elements
- Real-time: Socket.io bidirectional streaming

**From video-strategy.md** (3 Epics):
- Epic 1: Monorepo Setup with Basic Server & Client
- Epic 2: Claude Agent SDK Integration
- Epic 3: React Frontend with Chat Interface

**Say While PM Works**:
> "John is synthesizing our planning docs into a structured tech-spec. He's defining the technology stack, epic breakdown, and architecture. This becomes the foundation for story creation."

**Optional: YOLO Mode**
```
PM: *yolo
[Toggle on - skips elicitation prompts]
PM: *tech-spec
[Runs without stopping for refinement]
```

**Say if using YOLO**:
> "I'm using YOLO mode to skip interactive refinement - our planning is comprehensive enough that John can generate the tech-spec automatically."

**Output**: `bmad/bmm/output/tech-spec.md` with ~10-13 stories across 3 epics

---

### **PHASE 3: Story Planning** (5 minutes)

**Command**: Load Bob (Scrum Master)
```
*draft
```

**Say**:
> "Bob is the Scrum Master. He takes John's tech-spec and creates detailed implementation stories. In v4, this is a single-step workflow."

**Expected Stories** (from tech-spec):
- **Epic 1 stories**: Workspace setup, Express server, basic client, integration test (~3-4 stories)
- **Epic 2 stories**: SDK integration, custom tools, BMAD hooks, Socket.io (~4-5 stories)
- **Epic 3 stories**: React setup, shadcn/ui, AI Elements, Socket.io client (~3-4 stories)

**Say While Bob Works**:
> "Bob is breaking down each epic into implementable stories with clear acceptance criteria. These stories will guide development and ensure we build exactly what's in the tech-spec."

**Output**: Story files in `bmad/bmm/stories/`

---

### **PHASE 4: Implementation** (Not in video - reference only)

**Command**: Load Dev (James)
```
*develop-story 1.1
```

**Say**:
> "At this point, we'd normally hand off to James the Developer to implement stories. For this video, I'm showing the BMAD planning workflow - implementation would be a separate video."

**Highlight**:
- BMAD quality gates enforce ACTIVE_STORY requirement
- Each story references the tech-spec and architecture
- Development is story-driven, not ad-hoc

---

### **PHASE 5: Demo the Application Concept** (5 minutes)

**Say**:
> "Let me show you what we're planning to build. This is the vision from our planning docs."

**Show on screen** (visual-concepts.md):
- Three-layer architecture diagram
- Two paradigms comparison (Context Engineering vs Vibe Coding)
- Demo sequence flow

**Walk through demo-sequence.md**:
1. User opens browser → sees text box
2. Types: "Create 3 products"
3. App generates `data/products.json`
4. Types: "Show me a product listing page"
5. App generates `public/products.html`
6. Types: "Add a homepage"
7. App creates homepage with featured products

**Say**:
> "This is the self-editing application - built WITH BMAD discipline (Context Engineering), then USED conversationally (Vibe Coding). BMAD ensures quality during development, then the app enables rapid feature addition through conversation."

---

### **WRAP-UP** (1-2 minutes)

**Command**:
```
*workflow-status
```

**Say**:
> "workflow-status shows our complete BMAD workflow state - we've gone from planning documents to executable tech-spec with detailed stories. Ready for implementation."

**Expected Output**:
```
Project: BMAD + Claude SDK Self-Editing App
Track: Quick Flow (Greenfield)
Phase: Implementation Ready
- Analysis: ✓ (Planning docs reviewed)
- Planning: ✓ (Tech-spec created)
- Solutioning: Ready (Stories created)
Stories: 10-13 ready for implementation
```

**Say**:
> "What we've demonstrated:
> - BMAD v4 Quick Flow for focused projects
> - Converting planning docs into structured BMAD artifacts
> - workflow-init for project setup
> - Tech-spec creation with PM (John)
> - Story creation with SM (Bob)
> - Quality gates that enforce story discipline
>
> The result: A clear roadmap from vision to implementation. BMAD formalizes your research, structures your planning, and guides your development.
>
> Next step: Implementation with BMAD quality gates.
>
> Repository links in description. Thanks for watching!"

---

## 📝 Video Production Notes

### Key Talking Points

1. **BMAD formalizes, doesn't replace** - We had comprehensive planning docs, BMAD structured them
2. **Quick Flow for focused projects** - Right-sized planning for clear scope
3. **workflow-status is your compass** - Always shows where you are and what's next
4. **Pre-answered questions** - bmad-execution-guide.md makes this repeatable
5. **Two paradigms in one project** - BMAD for building, Claude SDK for using

### Files to Reference During Recording

- `docs/planning/bmad-execution-guide.md` - Pre-answered questions
- `docs/planning/project-reference.md` - Master specification
- `docs/planning/tech-stack.md` - Technology decisions
- `docs/planning/video-strategy.md` - Epic structure
- `bmad/bmm/output/bmm-workflow-status.yaml` - Workflow state
- `bmad/bmm/output/tech-spec.md` - Generated tech-spec

### Technical Details to Highlight

**Self-Editing Architecture**:
- Monorepo: NPM workspaces
- Backend: Express + TypeScript + Claude SDK + Socket.io
- Frontend: React + Vite + shadcn/ui + Vercel AI Elements
- 3 custom tools: read_json, write_json, write_file
- Security: Path sandboxing (/data and /public only)
- BMAD: Quality gate hooks

**Epic Structure** (3 Epics):
1. Monorepo Setup with Basic Server & Client
2. Claude Agent SDK Integration
3. React Frontend with Chat Interface

### B-Roll Opportunities

- workflow-status output transitions
- Planning docs in docs/planning/
- Generated tech-spec.md
- Story files in bmad/bmm/stories/
- Architecture diagrams from visual-concepts.md
- BMAD folder structure

### Common Issues & Solutions

**If workflow-init fails**:
- Verify BMAD v4 installed: `npx bmad-method install`
- Check in correct directory (project root)
- Ensure no old BMAD artifacts conflict

**If tech-spec generation stalls**:
- Provide more context from planning docs
- Reference specific files (project-reference.md, tech-stack.md)
- Use YOLO mode if questions are repetitive

**If stories don't match epic structure**:
- Correct PM and reference video-strategy.md
- Ensure 3 epics clearly defined in tech-spec
- Check each epic has success criteria

---

## ✅ Post-Recording Checklist

- [ ] Video shows workflow-init complete flow
- [ ] Mary references our planning docs (not generic questions)
- [ ] John creates tech-spec using our specific context
- [ ] Tech-spec shows 3 epics clearly
- [ ] Bob creates stories from tech-spec
- [ ] workflow-status transitions shown
- [ ] Demo concept explained (self-editing via text box)
- [ ] BMAD v4 repository links included
- [ ] Next steps mentioned (implementation phase)

---

**Created**: 2025-11-13
**BMAD Version**: v4 (stable)
**Repository**: https://github.com/bmad-code-org/BMAD-METHOD/
**v6 Reference**: https://github.com/bmad-code-org/BMAD-METHOD/tree/v6.0.0-alpha.9
**Project**: Self-Editing Claude SDK App with BMAD Integration
