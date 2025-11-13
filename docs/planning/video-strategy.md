---
title: Video Strategy
purpose: Video narrative structure with epic breakdown and comparison paradigm
audience: Video planning, understanding project flow and demonstration strategy
when_to_read: Planning video recording, understanding demo flow
key_sections: [Core Concept, Epic Structure, Growth Vectors, Open Questions]
status: active
---

# Video Strategy: Context Engineering vs Vibe Coding

## Core Concept

**Not**: "How to use BMAD + Claude SDK"

**Actually**: "Two paradigms of AI-powered development - demonstrated, compared, and contrasted"

---

## ⚠️ CRITICAL: Security Disclaimer Required

**This demo shows a self-modifying application** - powerful for learning, dangerous for production.

**Video MUST include disclaimer**:
- After the hook, before diving in
- Clear "Educational/MVP Only" messaging
- Explain risks: prompt injection, code injection, path traversal
- Appropriate use cases vs. dangerous use cases

**See**: `security-considerations.md` for full disclaimer text and attack vectors.

**Key message**: "Great for MVPs and learning, requires significant hardening for production."

---

## The Demonstration

### What People Will See

**A data-driven application that evolves itself:**

1. User describes new data they want
2. System builds the data structure
3. System **rebuilds its own UI** to represent:
   - Changing data size
   - Changing data structure
   - Changing data relationships

**This showcases Claude SDK's true power** - most people don't realize this is possible.

---

## The Comparison: Two Development Paradigms

### Context Engineering (Stage 1)
**Using**: BMAD-METHOD + Claude Code

**Characteristics**:
- Structured, documented, methodical
- Requirements → Architecture → PRD → Epics → Stories
- Work story-by-story
- Quality gates, traceability, artifacts

**Outcome**: Express server with embedded Claude SDK

### Vibe Coding (Stage 2)
**Using**: The built application's Claude SDK (text box)

**Characteristics**:
- Casual, conversational
- "Add these products" → done
- No BMAD, no methodology (unless bugs need fixing)
- Rapid iteration, exploratory

**Outcome**: Data + UI pages generated on-the-fly

### The Discussion

Throughout video: strengths, weaknesses, when to use each approach.

---

## Growth Vectors (Why This Video Will Hit)

### 1. BMAD-METHOD Community
- Brian's channel: 6k → 20k+ subscribers in months
- We're connected, future collaboration planned
- **Massive growth trajectory**
- Community hungry for practical examples

### 2. Claude SDK Power
- **Underestimated by the market**
- People don't know what it can do
- Self-modifying applications
- Data-driven UI regeneration
- This demonstrates capabilities people haven't seen

### 3. Claude Code + Claude SDK (Trending)
- Claude Code: Hot topic
- Claude SDK: Same foundations, less known
- Demonstrates transition from structured to conversational development

### 4. Comparison Narrative
- "Context Engineering vs Vibe Coding" is **novel framing**
- Resonates with both camps:
  - Engineers who want rigor → Context Engineering
  - Builders who want speed → Vibe Coding
- Not "one is better" - "here's when to use each"

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
- Technology options: Vanilla JS, Vercel templates, or off-the-shelf solution (TBD)

**BMAD artifacts**: Stories continue, quality gates maintained

---

### Epic 3: Conversational Development (The Demo)
**THE PIVOT**: Leave BMAD, leave Claude Code, use the text box

**Goal**: Demonstrate self-editing application in action
- Use text box to create data structures (products.json, blog.json)
- Use text box to generate UI pages (list views, detail views)
- Show application modifying itself through conversation
- Progressive feature addition

**Not BMAD**: This is pure "Vibe Coding" demonstration
- No stories, no architecture docs
- Just conversational requests → code generation
- Shows the power of Claude SDK in action

---

## Title/Thumbnail Strategy

**Working Title** (not finalized):
> **"BMAD + Claude SDK: Building Apps that Build Themselves"**

**See**: `youtube-title-thumbnail.md` for detailed title analysis, thumbnail concepts, and SEO strategy.

**Note**: Title/thumbnail development postponed until content is more complete.

---

## Strategic Value

### Why This Works

1. **Multiple entry points**: BMAD fans, Claude Code users, SDK curious, AI developers
2. **Educational**: Teaches two paradigms, not just one tool
3. **Practical**: Working demo people can clone/modify
4. **Timely**: All topics trending NOW
5. **Collaborative potential**: Brian connection = future amplification
6. **Novel framing**: "Context Engineering vs Vibe Coding" = fresh angle

### What Makes It Unique

Not another "tool tutorial" - this is:
- Comparative analysis of two paradigms
- Philosophical discussion (when to use rigor vs speed)
- Technical demonstration of both
- Shows capabilities people haven't seen (self-modifying apps)
- **Bidirectional workflow**: Skills bridge exploration → implementation
- Real-world pattern developers can adopt immediately

---

## Open Questions

1. **Frontend technology choice**: Vanilla JS, Vercel template, or other off-the-shelf solution?
2. **Demo complexity**: Balance showing power vs keeping it accessible
3. **Story arc**: Which paradigm do we demonstrate first?
   - Option A: Vibe coding first (fast wins) → then show structure
   - Option B: Context engineering first (foundation) → then show speed
4. **Call to action**: BMAD community? GitHub repo?
5. **Demo application domain**: What will we build in Epic 3? (products? blog? other?)

---

## Evolution Notes

This document will change as we:
- Refine the technical implementation
- Discover better ways to demonstrate the contrast
- Identify specific Claude SKILLS applications
- Test messaging with the community
- Develop the narrative arc
