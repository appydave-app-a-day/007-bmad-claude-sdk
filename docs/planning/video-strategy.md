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

### 3. Claude Code + Claude SKILLS (Trending)
- Claude Code: Hot topic
- Claude SDK: Same foundations, less known
- Claude SKILLS: Potential fourth element (trifecta → quad?)

### 4. Comparison Narrative
- "Context Engineering vs Vibe Coding" is **novel framing**
- Resonates with both camps:
  - Engineers who want rigor → Context Engineering
  - Builders who want speed → Vibe Coding
- Not "one is better" - "here's when to use each"

---

## The Quad (Confirmed)

**Four trending topics working together:**
1. **BMAD-METHOD** - Context Engineering methodology
2. **Claude Code** - Structured development environment
3. **Claude SDK** - Vibe coding runtime
4. **Claude SKILLS** - Bidirectional workflow bridge

### How SKILLS Complete the Picture

**SKILL 1: A/B UI Generator** (Stage 2 - Vibe Coding)
- User: "Generate 3 layout variations"
- Creates `/ab-test/` with variations + documentation
- User browses, picks favorite
- **Demonstrates**: Vibe coding's exploratory power

**SKILL 2: BMAD Story Generator** (Stage 1 - Context Engineering)
- User switches to Claude Code
- Reads SKILL 1's mocks and docs
- Generates proper BMAD story with acceptance criteria
- **Demonstrates**: Context engineering's structured rigor

**The Bridge**: Skills connect both paradigms
- Explore with vibe coding → Implement with context engineering
- Two contexts, working together, same workflow

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

1. ~~**Claude SKILLS integration**: How to include naturally?~~ ✅ **SOLVED**
   - Two skills: A/B UI Generator (vibe) + BMAD Story Generator (structured)
   - See `skills-design.md` for complete specification
2. **Demo complexity**: Balance showing power vs keeping it accessible
3. **Story arc**: Which paradigm do we demonstrate first?
   - Option A: Vibe coding first (fast wins) → then show structure
   - Option B: Context engineering first (foundation) → then show speed
4. **Call to action**: BMAD community? GitHub repo? Collaboration with Brian?
5. **SKILLS technical depth**: How much of skill implementation to show in video?

---

## Evolution Notes

This document will change as we:
- Refine the technical implementation
- Discover better ways to demonstrate the contrast
- Identify specific Claude SKILLS applications
- Test messaging with the community
- Develop the narrative arc
