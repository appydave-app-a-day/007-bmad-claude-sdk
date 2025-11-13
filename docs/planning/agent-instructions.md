# Agent Instructions: Content Intake & Synthesis

## Core Mission

Extract valuable insights from URLs and ChatGPT dumps. Cherry-pick ruthlessly. Produce tight, compact, information-dense documentation.

**Guiding Principle**: "I would have written a shorter letter, but I did not have the time." (Mark Twain / Blaise Pascal)

Concise writing requires more work. Do that work.

**Operating Mode**: Deep thinking without time limits. Take time to analyze thoroughly, consider alternatives, identify patterns, and synthesize insights. Quality over speed.

---

## Intake Process

### When Receiving URLs or ChatGPT Content

**1. Archive Immediately**

Create timestamped file in `.archive/`:
```
.archive/YYYY-MM-DD-[source]-[topic].md
```

**2. Add Meta Header**

```markdown
---
source: [URL or "ChatGPT conversation"]
date: YYYY-MM-DD
topics: [claude-sdk, schema-builder, crud, html-builder, bmad-alpha]
phase: [Phase 1 - BMAD Development | Phase 2 - Runtime SDK]
relevance: [high|medium|low]
key-insights:
  - Concise insight 1 (one line)
  - Concise insight 2 (one line)
  - Concise insight 3 (one line)
extracted-quotes:
  - "Direct quote if particularly valuable"
---

[Full content below]
```

**3. Do NOT Update Working Documents Yet**

Accumulate archives. Synthesize later.

**4. Acknowledge Receipt**

Brief message:
- What was archived
- 2-3 key insights extracted
- Estimated relevance to current phase

---

## Synthesis Rules

### Targets
- **Primary doc**: 1-2 pages max (tight, dense, actionable)
- **Technical reference**: Can be longer but still concise
- **No fluff**: Every sentence earns its place

### Cherry-Picking Criteria

**Include if:**
- Directly actionable (can code/build from it)
- Clarifies a previous misunderstanding
- Provides concrete example/pattern
- Answers "how" or "why" for current phase

**Exclude if:**
- Already known/documented
- Tangential to current goals
- Overly general/obvious
- Belongs in future phase

### Writing Style
- Short sentences
- Active voice
- Specific over vague
- Examples over explanations where possible
- Code snippets over prose descriptions

---

## Self-Improvement Capability

When user requests **"self-improvement"**, I will:

1. Acknowledge what went wrong
2. Propose specific instruction changes
3. Update this file with refined rules
4. Confirm changes made

**Example triggers:**
- "Too verbose" → Add brevity rule
- "Missed key point" → Refine cherry-picking criteria
- "Wrong focus" → Update relevance criteria
- "Bad format" → Adjust structure template

### Improvement Log

Track changes at bottom of this file:

```markdown
## Change History

### 2025-10-27 - Initial creation
- Created intake process
- Defined synthesis rules
- Established self-improvement protocol
```

---

## Current Project Context

### Two SEPARATE Stages (Not Integrated)

**Stage 1: Building the Application (Context Engineering)**
- **Tools**: BMAD-METHOD (alpha/beta - using latest available) + Claude Code
- **Authentication**: Claude CLI OAuth (`claude auth login`) - NO API keys
- **Output**: Express server with embedded Claude SDK
- **Process**: BMAD generates requirements, architecture, PRD, epics → work story-by-story
- **User demonstrates this** - I observe, don't create BMAD docs myself

**Stage 2: Using the Application (Vibe Coding)**
- **Tools**: The app's embedded Claude SDK (text box interface)
- **Output**: Data structures (JSON) + HTML pages
- **Process**: Casual conversational requests → SDK generates data/UI
- **No BMAD needed** in this stage (unless bugs require fixes)
- **Same working directory** but completely decoupled from Stage 1

**Critical Understanding**: These are separate demonstrations of two AI development paradigms, not an integrated system.

### Demo Flow (Phase 2 Focus)
1. Create product schema
2. Add 3 sample products
3. Generate product list page
4. Generate product detail page
5. Enhance schema (tags, keywords, featured flags)
6. Add more products with metadata
7. Improve product detail page
8. Build homepage with featured products

### Learning Outcome
Comparative demonstration of two AI development paradigms:
- **Context Engineering** (Stage 1): BMAD + Claude Code - structured, documented, methodical
- **Vibe Coding** (Stage 2): Claude SDK - casual, conversational, exploratory

### Strategic Context
- **BMAD community growth**: 6k → 20k+ subscribers (Brian's channel)
- **Claude SDK power**: Underestimated - self-modifying apps, data-driven UI regeneration
- **Novel framing**: "Context Engineering vs Vibe Coding" comparison
- **Four trending topics**: BMAD-METHOD, Claude Code, Claude SDK, Claude SKILLS

### Claude SKILLS Integration (Confirmed)
**SKILL 1 - A/B UI Generator** (Stage 2 - Vibe Coding):
- Generates 3 layout variations in `/ab-test/` subfolder
- Creates chooser page + documentation
- User browses, picks favorite
- Demonstrates exploratory vibe coding

**SKILL 2 - BMAD Story Generator** (Stage 1 - Context Engineering):
- Runs in Claude Code
- Reads SKILL 1's mocks and documentation
- Generates BMAD story with acceptance criteria
- Sets ACTIVE_STORY for structured implementation
- Demonstrates context engineering rigor

**Bidirectional Workflow**: Explore (vibe) → Decide → Implement (structured)

See `skills-design.md` for complete specification.

### Tool Semantics Note
Built-in Claude Code tools (not user-defined concepts). Reference Claude Code documentation for specifics.

---

## Change History

### 2025-10-27 - Initial creation
- Created intake process
- Defined synthesis rules
- Established self-improvement protocol
- Set conciseness as core principle

### 2025-10-27 - Added deep thinking mode
- Updated operating mode: deep thinking without time limits
- Prioritize thoroughness and quality over speed
- User expectation: take time to analyze, consider alternatives, synthesize

### 2025-10-27 - Corrected understanding of two-stage separation
- Stage 1 (Context Engineering) and Stage 2 (Vibe Coding) are SEPARATE, not integrated
- Authentication: Claude CLI OAuth only (no API keys)
- BMAD version: Using latest available (alpha now, beta expected soon)
- Added strategic context: community growth, trending topics, Claude SKILLS exploration
- Created `video-strategy.md` for YouTube positioning and evolution

### 2025-10-27 - Self-improvement: Visual concepts documentation
**User feedback**: "A lot of concepts get lost before going to the final document"
**Issue**: Optimizing for conciseness was losing production-ready visual concepts
**Solution**: Created `visual-concepts.md` for infographic ideas, flows, diagrams
**Learning**: Tight technical docs need companion visual/production docs
**New practice**:
  - Capture flows, comparisons, diagrams separately
  - Make them Napkin AI / Gamma AI ready
  - Include video overlay graphics and timing notes
**Also created**: `youtube-title-thumbnail.md` to separate YouTube-specific exploration from strategy doc

### 2025-10-27 - Self-improvement: Aggressive cherry-picking
**User feedback**: "Be extra careful with cherry picking... lots of useful stuff but not useful for our situation"
**Document**: SDK deep dive with MCP, OpenAI bridge, streaming internals, orchestration
**Extracted** (minimal):
  - System prompt should be separate file, can evolve → created `system-prompt.md`
  - Final result approach (not streaming blocks) confirmed ✅
  - Custom tools (not MCP) validated ✅
  - Permission mode: auto-accept for sandbox ✅
**Deliberately ignored** (not relevant to our focused demo):
  - MCP (Model Context Protocol) - user has no desire to use
  - OpenAI-compatible bridge - explicitly rejected
  - Streaming blocks implementation - using final result instead
  - Multi-agent orchestration - future, not v1
  - Session resume - nice-to-have, not core
  - Obsidian integration - not relevant
**Learning**: Rich technical docs can contain 90% irrelevant detail. Extract only what directly serves our specific implementation. "Useful" ≠ "useful for us."

### 2025-10-27 - Claude Skills feature documentation
**Document**: ChatGPT explanation of new Claude Code Skills feature + YouTube reference
**Extracted** (targeted to SKILLS design):
  - Skills structure: manifest (YAML/JSON) + instructions + scripts + resources
  - Skills are modular, reusable, portable across Claude environments
  - Skills reduce need to re-specify context (domain memory)
  - Two implementation options: simple custom tools vs formal Skills with manifests
  - Updated `skills-design.md` with technical implementation options
**Deliberately ignored**:
  - BMAD positioning narrative (video framing, not implementation)
  - Strategic discussion (not code-relevant)
  - General benefits explanation (obvious/redundant)
**Action**: Added "What Are Claude Skills?" section to skills-design.md, documented both implementation approaches (v1 simple, v2 formal)

### 2025-10-27 - Official Anthropic documentation batch (12 URLs via a1-a10.txt)
**Documents**: SDK TypeScript repo, Skills API docs, Skills best practices, Client SDKs, Building effective agents, Claude Code best practices, Skills blog posts, GitHub skills repo
**Extracted** (~2% extraction rate):
  - SDK usage patterns confirmed ✅ (no changes needed)
  - Beta headers noted: `betas: ['code-execution-2025-08-25', 'skills-2025-10-02']`
  - ACI principle confirmed: "invest as much effort in ACI as HCI"
  - Skills clarification: Claude Code/API feature (NOT what we're building)
**Deliberately ignored** (98% filtering):
  - All Skills API documentation (not using Skills feature)
  - All SKILL.md authoring guidance (not building Skills)
  - All Claude Code workflows (Stage 1, not Stage 2)
  - All Skills architecture details (interesting but not needed)
  - SDK examples for Python/Java/Go/C#/Ruby/PHP (using TypeScript)
  - Files API, Message Batches, MCP, AWS Bedrock (not using)
  - Document Skills (xlsx, pptx, pdf, docx - not our domain)
  - Beta features we're not using (code execution, Skills API)
**Critical learning**: "Skills" are a Claude feature (like MCP), not something we implement in our demo. Our demo uses custom SDK tools (read_json, write_json, write_file), which is a completely different pattern.
**Action**: Created comprehensive summary in `.archive/2025-10-27-official-docs-processing-summary.md`. Zero changes to working docs - everything confirmed accurate.
