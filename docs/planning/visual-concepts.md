---
title: Visual Concepts for BMAD Requirements
purpose: Architecture diagrams and visual concepts for creating BMAD PRD
audience: BMAD agents creating PRD/architecture documentation
when_to_read: Generating BMAD artifacts, need visual representations of architecture
key_sections: [Two Paradigms Comparison, Architecture Diagrams, Epic Structure, Success Metrics]
status: active
---

# Visual Concepts for BMAD Requirements

---

## Two Development Paradigms

### Side-by-Side Comparison

| Aspect | Stage 1: Context Engineering | Stage 2: Vibe Coding |
|--------|------------------------------|----------------------|
| **Tools** | BMAD + Claude Code | Claude SDK (text box) |
| **Speed** | Methodical, story-by-story | Instant, conversational |
| **Output** | Express server with embedded SDK | Data + HTML pages |
| **Rigor** | High - PRD, epics, stories, tests | Low - explore, iterate, discard |
| **Use Case** | Building the foundation | Adding features quickly |
| **Documentation** | Automatic (BMAD artifacts) | Optional (can be generated) |
| **Quality Gates** | Enforced (ACTIVE_STORY required) | Minimal (sandboxing only) |
| **Mindset** | "Build it right" | "Try it out" |
| **Iteration** | Story → implement → test → next story | Type → see result → adjust → repeat |
| **Best For** | Core functionality, production features | Exploration, prototyping, demos |

---

## Two Paradigms: Visual Metaphor

### Context Engineering (Architect)

```
┌─────────────────────────────────────┐
│         CONTEXT ENGINEERING         │
│                                     │
│   🏗️  Like building a skyscraper   │
│                                     │
│   • Blueprints first (PRD/stories)  │
│   • Quality inspections             │
│   • Safety regulations              │
│   • Documented process              │
│   • Built to last                   │
│                                     │
│   Tools: BMAD + Claude Code         │
└─────────────────────────────────────┘
```

### Vibe Coding (Sculptor)

```
┌─────────────────────────────────────┐
│           VIBE CODING               │
│                                     │
│   🎨  Like sculpting with clay      │
│                                     │
│   • Start with rough shape          │
│   • Iterate by feel                 │
│   • Try multiple versions           │
│   • Discover as you go              │
│   • Quick pivots                    │
│                                     │
│   Tools: Claude SDK (text box)      │
└─────────────────────────────────────┘
```

### When to Use Which

```
┌──────────────────┬────────────────────┬─────────────────────┐
│    SCENARIO      │  CONTEXT ENG       │   VIBE CODING       │
├──────────────────┼────────────────────┼─────────────────────┤
│ Core features    │        ✅          │                     │
│ Exploration      │                    │        ✅           │
│ Production code  │        ✅          │                     │
│ Prototyping      │                    │        ✅           │
│ Team projects    │        ✅          │                     │
│ Solo experiments │                    │        ✅           │
│ Long-term code   │        ✅          │                     │
│ Quick tests      │                    │        ✅           │
└──────────────────┴────────────────────┴─────────────────────┘
```

---

## Stage 1 → Stage 2 Architecture

### What Gets Built

```
STAGE 1 (BMAD + Claude Code)
         │
         │ Builds:
         ▼
┌─────────────────────────────────────────┐
│     Express Server + Claude SDK         │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │   Three Tools:                    │  │
│  │   1. read_json (data/*)           │  │
│  │   2. write_json (data/*)          │  │
│  │   3. write_file (public/*)        │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │   Quality Gates:                  │  │
│  │   - Sandboxing (/public, /data)   │  │
│  │   - ACTIVE_STORY enforcement      │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │   Frontend:                       │  │
│  │   - Text box interface            │  │
│  │   - Tailwind CSS                  │  │
│  │   - POST /chat endpoint           │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
         │
         │ Used in:
         ▼
STAGE 2 (Vibe Coding)
  User types → SDK generates data & pages
```

---

## Three-Layer System

```
┌─────────────────────────────────────────┐
│  Frontend (Static HTML + Tailwind)     │
│  - Conversational text box              │
│  - Product listing page                 │
│  - Product detail pages                 │
│  - Landing page                         │
└─────────────────────────────────────────┘
                  ↓ HTTP POST
┌─────────────────────────────────────────┐
│  Backend (Express + Agent SDK)          │
│  - POST /chat (final result)            │
│  - Static file serving                  │
│  - Claude Agent with custom tools       │
└─────────────────────────────────────────┘
                  ↓ File I/O
┌─────────────────────────────────────────┐
│  Data Layer                             │
│  - /data/products.json                  │
│  - /public/*.html (generated)           │
└─────────────────────────────────────────┘
```

---

## Epic Structure

### Epic 1: Server Application with Claude SDK Event Loop

**Using**: BMAD Method v4 + Claude Code

**Goal**: Create Express server with Claude Agent SDK integration
- Core Claude SDK event loop
- Basic server setup and authentication
- Custom tools framework (read_json, write_json, write_file)
- Sandboxing and safety constraints

**BMAD artifacts**: PRD, Architecture, Stories, ACTIVE_STORY

---

### Epic 2: HTML Frontend with Text Interface

**Using**: BMAD Method v4 + Claude Code

**Goal**: Create simple frontend to communicate with the SDK
- HTML form with text input
- Streaming capability (if needed)
- Communication with `/chat` endpoint
- Technology options: Vanilla JS, or off-the-shelf solution (TBD)

**BMAD artifacts**: Stories continue, quality gates maintained

---

### Epic 3: Conversational Development (The Demo)

**THE PIVOT**: Leave BMAD, leave Claude Code, use the text box

**Goal**: Demonstrate self-editing application in action
- Use text box to create data structures (products.json)
- Use text box to generate UI pages (list views, detail views)
- Show application modifying itself through conversation
- Progressive feature addition

**Not BMAD**: This is pure "Vibe Coding" demonstration
- No stories, no architecture docs
- Just conversational requests → code generation
- Shows the power of Claude SDK in action

**See**: `demo-sequence.md` for detailed step-by-step flow

---

## Core Concept for PRD

**What We're Building (Requirements)**:
- Backend: Express server with Claude Agent SDK (~100-200 LOC)
- Frontend: Single HTML page with a text box
- Tools: 3 custom tools (read_json, write_json, write_file)
- Hooks: BMAD quality gates (active story requirement)

**What the Application Builds for Itself (Through Conversation)**:
- Data structures (products.json, blog.json, etc.)
- List and detail pages (HTML)
- Landing page with featured content
- Updates to existing functionality

**Key Insight**: We're NOT coding the product catalog or blog features. We're coding the self-editing application that modifies itself to add these features through conversation.

---

## Success Metrics for BMAD PRD

### Code Quality
- Backend under 200 lines
- Generic tools (no domain knowledge)
- Type-safe TypeScript
- Clean separation of concerns

### BMAD Alignment
- PRD defines self-editing application (not specific features)
- Stories guide framework development
- Active story enforced by hooks
- Application can update its own documentation

### Demo Value
- Shows self-editing application in action
- Demonstrates progressive development
- Application validates itself
- Works for any domain (products, blog, etc.)
- BMAD discipline maintained in Epics 1-2
