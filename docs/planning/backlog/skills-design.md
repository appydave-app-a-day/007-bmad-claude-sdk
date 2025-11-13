# Claude SKILLS Design: Bidirectional Workflow

## The Quad Achievement

**Four trending topics working together:**
1. **BMAD-METHOD** - Context Engineering
2. **Claude Code** - Structured development
3. **Claude SDK** - Vibe coding runtime
4. **Claude SKILLS** - Bridging tool (two skills, two contexts)

---

## What Are Claude Skills?

**From Anthropic's new Skills feature:**

Skills are modular, reusable capabilities that extend Claude's abilities. Each Skill is essentially a folder bundling:
- **Manifest** (YAML/JSON): Defines inputs, purpose, environment
- **Instructions**: Prompts/context for the skill
- **Scripts**: Executable code
- **Resources**: Templates, style guides, etc.

Skills work across Claude chat, Claude Code, API, and Agent SDK. They reduce need to re-specify context - Claude "remembers" rules/style for that domain.

**For our project**: We're implementing two custom Skills to demonstrate the bidirectional workflow between vibe coding and context engineering.

---

## The Two Skills

### SKILL 1: A/B UI Generator (Stage 2 - Vibe Coding)

**Context**: User interface (text box in browser)

**Trigger**: User types in text box:
> "Generate 3 layout variations for the product listing page"

**Actions**:
1. Analyzes current data structure (products.json)
2. Generates 3 UI variations in subfolder:
   - `/ab-test/products-grid.html` (card grid layout)
   - `/ab-test/products-table.html` (data table layout)
   - `/ab-test/products-masonry.html` (Pinterest-style masonry)
3. Creates navigation page: `/ab-test/index.html` with:
   - Side-by-side preview thumbnails
   - Links to each variation
   - "Choose this one" buttons
4. Generates documentation: `/ab-test/variations.md`:
   - What each variation does
   - Trade-offs (density vs visual appeal)
   - Recommended use cases

**Output visible to user**:
- "Created 3 variations! View at /ab-test/index.html"
- User browses variations, picks favorite

**Key demonstration**:
- SDK's self-modification power
- Vibe coding exploratory workflow
- Data-driven UI generation

---

### SKILL 2: BMAD Story Generator (Stage 1 - Context Engineering)

**Context**: Claude Code (structured development)

**Trigger**: User switches to Claude Code and runs skill:
> "Create BMAD story from A/B test variation 2"

**Actions**:
1. Reads `/ab-test/variations.md` (Skill 1's documentation)
2. Reads chosen variation HTML
3. Analyzes differences from current production page
4. Generates BMAD story file: `bmad/bmm/stories/story-NNN-implement-table-layout.md`:
   - **Objective**: Implement table-based product listing layout
   - **Context**: Based on A/B test variation 2 (user-approved)
   - **Acceptance Criteria**:
     - Replace current grid with table layout
     - Maintain responsive behavior
     - Add sorting capability
     - Match approved design from A/B test
   - **Technical Notes**: (extracted from variation code)
5. Updates `ACTIVE_STORY.md` to point to new story
6. Creates architecture note if needed

**Output visible to user**:
- "Created story-015-implement-table-layout.md"
- "Set as ACTIVE_STORY"
- "Ready for structured implementation with BMAD workflow"

**Key demonstration**:
- Skill reads another skill's output
- Vibe coding → Context engineering transition
- Mocks become requirements
- Exploration becomes structured implementation

---

## The Bidirectional Workflow

### Explore → Implement (Primary flow)

```
Stage 2 (Vibe Coding)
  User: "Generate 3 product page layouts"
  ↓
SKILL 1: A/B UI Generator
  Creates: /ab-test/* with 3 variations + docs
  ↓
User browses, picks variation 2
  ↓
Stage 1 (Context Engineering)
  User switches to Claude Code
  User: "Create BMAD story from variation 2"
  ↓
SKILL 2: BMAD Story Generator
  Reads: Skill 1's mocks + docs
  Creates: BMAD story with acceptance criteria
  ↓
BMAD workflow implements properly
```

### Quick Tweaks (Vibe coding only)

```
Stage 2 (Vibe Coding)
  User: "Change that checkbox to a dropdown"
  ↓
SDK modifies directly (no SKILL needed)
  Updates HTML
```

### Major Features (Context engineering)

```
Stage 1 (Context Engineering)
  User: "Add shopping cart functionality"
  ↓
BMAD creates epic + stories
  ↓
Implement with rigor, testing, documentation
```

---

## Why This Works (Video Narrative)

### The Contrast Becomes Clear

**Vibe Coding (Stage 2):**
- Fast exploration
- Multiple options generated instantly
- User browses, picks, discards
- Low commitment, high velocity
- SKILL 1 amplifies this: "Show me 3 ways" → done

**Context Engineering (Stage 1):**
- Structured implementation
- Documented requirements
- Tested, validated, tracked
- High commitment, high quality
- SKILL 2 bridges the gap: "Take what worked, make it production-ready"

### Skills Demonstrate Both Paradigms

**SKILL 1** shows vibe coding's strength:
- "I don't know what I want - show me options"
- Exploratory, creative, rapid iteration

**SKILL 2** shows context engineering's strength:
- "I know what I want - implement it properly"
- Structured, documented, quality-gated

### They Work Together

Not "one is better" - they're complementary:
1. **Explore** with vibe coding (SKILL 1)
2. **Decide** what works
3. **Implement** with context engineering (SKILL 2)

This is a **real-world workflow** developers can adopt.

---

## Technical Implementation Notes

### Implementation Options

**Option A: Simple Custom Tools** (v1 - recommended for demo)
- Implement as regular SDK tools (functions)
- No manifest overhead
- Easier to explain/demo

**Option B: Formal Skills with Manifests** (future enhancement)
```
skills/
├── ab-ui-generator/
│   ├── manifest.yaml
│   ├── instructions.md
│   ├── templates/
│   │   ├── grid.html
│   │   ├── table.html
│   │   └── masonry.html
│   └── generate.js
└── bmad-story-generator/
    ├── manifest.yaml
    ├── instructions.md
    ├── templates/
    │   └── story-template.md
    └── generate.js
```

**Decision for demo**: Start with Option A (simple tools), mention Option B as future evolution.

---

### SKILL 1: A/B UI Generator

**Location**: Embedded in Stage 2 app (Claude SDK)

**Implementation**: Custom SDK tool

**Inputs**:
- Current data structure (products.json)
- User's vibe request ("show me 3 layouts")

**Outputs**:
- `/ab-test/variation-1.html`
- `/ab-test/variation-2.html`
- `/ab-test/variation-3.html`
- `/ab-test/index.html` (chooser page)
- `/ab-test/variations.md` (documentation)

**Key code pattern**:
```javascript
// SKILL 1 pseudo-code (as custom tool)
const generateABVariations = {
  name: 'generate_ab_variations',
  description: 'Generate 3 UI layout variations for A/B testing',
  inputSchema: {
    type: 'object',
    properties: {
      pageType: { type: 'string' },
      dataPath: { type: 'string' }
    }
  },
  handler: async ({ pageType, dataPath }) => {
    const variations = [
      { name: 'grid', template: generateGrid(dataPath) },
      { name: 'table', template: generateTable(dataPath) },
      { name: 'masonry', template: generateMasonry(dataPath) }
    ];

    writeVariations('/ab-test/', variations);
    writeChooserPage('/ab-test/index.html', variations);
    writeDocumentation('/ab-test/variations.md', variations);

    return 'Created 3 variations at /ab-test/';
  }
};
```

### SKILL 2: BMAD Story Generator

**Location**: Claude Code skill (Stage 1)

**Implementation**: Claude Code skill (with manifest if using formal Skills)

**Inputs**:
- `/ab-test/variations.md` (from SKILL 1)
- Chosen variation HTML
- Current codebase context

**Outputs**:
- `bmad/bmm/stories/story-NNN-*.md`
- Updated `ACTIVE_STORY.md`
- Optional: Architecture notes

**Key pattern** (if using Claude Code skills):
```bash
# SKILL 2 usage
claude-code skill bmad-story-from-ab-test \
  --variation /ab-test/variation-2.html \
  --story-name "implement-table-layout"
```

**Alternate** (if using custom tool in SDK):
```javascript
const generateBMADStory = {
  name: 'generate_bmad_story',
  description: 'Create BMAD story from approved A/B variation',
  inputSchema: {
    type: 'object',
    properties: {
      variationPath: { type: 'string' },
      storyName: { type: 'string' }
    }
  },
  handler: async ({ variationPath, storyName }) => {
    const variations = readFile('/ab-test/variations.md');
    const chosenHTML = readFile(variationPath);

    const story = generateStoryFromVariation(variations, chosenHTML, storyName);
    writeFile(`bmad/bmm/stories/story-${nextId}-${storyName}.md`, story);
    writeFile('bmad/bmm/stories/ACTIVE_STORY.md', `story-${nextId}-${storyName}.md`);

    return `Created ${storyName} story and set as active`;
  }
};
```

---

## Demo Sequence for Video

### Act 1: Vibe Coding Exploration (3 min)
1. Open browser to app
2. Type in text box: "Generate 3 layout options for products"
3. SKILL 1 creates variations
4. Browse `/ab-test/` page, show all 3
5. "I like the table layout - let's make it real"

### Act 2: Context Engineering Implementation (4 min)
6. Switch to Claude Code (VSCode/terminal)
7. Run SKILL 2: "Create BMAD story from variation 2"
8. Show generated story file
9. Show it became ACTIVE_STORY
10. Walk through structured implementation
11. Tests pass, quality gates enforced

### Act 3: The Comparison (2 min)
12. Side-by-side comparison:
    - Vibe coding: fast, exploratory, multiple options
    - Context engineering: rigorous, documented, production-ready
13. "Two skills, two paradigms, one workflow"

**Total**: ~9 minutes for SKILLS demonstration within larger video

---

## Extensions (Future/Optional)

### Additional Skill Pairs

**Pair 2**: Style Explorer + Theme Implementation
- SKILL 3: Generate 3 color/typography themes
- SKILL 4: Create design system story from chosen theme

**Pair 3**: Data Model Explorer + Migration Generator
- SKILL 5: Suggest 3 schema enhancements
- SKILL 6: Generate BMAD story + migration script

**Pattern**: Exploration skill (vibe) + Implementation skill (structured)

---

## Success Metrics

### Video Impact
- Demonstrates 4 trending topics working together
- Shows bidirectional workflow (explore → implement)
- Provides reusable pattern (exploration + implementation skills)
- Novel framing: skills as paradigm bridges

### Developer Adoption
- Pattern is generalizable (any feature can use this)
- Skills are composable (chain them)
- Workflow is intuitive (matches how people actually work)

---

## Open Questions

1. **SKILL 1 complexity**: How sophisticated should variation generation be?
2. **SKILL 2 intelligence**: How much BMAD context should it infer vs ask user?
3. **Chooser UI**: Interactive preview with live switching, or static pages?
4. **Documentation format**: Markdown sufficient, or JSON for machine readability?

---

## Next Steps

1. Design SKILL 1 interface (what user types in text box)
2. Define variation generation algorithm (grid/table/masonry)
3. Design SKILL 2 interface (Claude Code command structure)
4. Map SKILL 2 → BMAD story template
5. Script demo sequence for video

---

## Future Evolution: Foundational Pattern

**Note**: This self-editing application pattern is intended to become a **foundational architecture** for other AppyDave products:

- **Storyline App** - Could use this pattern for user-driven storyline template generation
- **SupportSignal Prompt App** - Could use this pattern for conversational prompt configuration
- Other apps that benefit from conversational, self-modifying capabilities

**Key insight**: Rather than building one-off custom tools, this project establishes a **reusable pattern** for applications that can extend themselves through conversation while maintaining quality discipline (BMAD gates).

**Exploration areas**:
- Shared npm package for the core framework?
- BMAD story template for "add self-editing capability to existing app"?
- Documentation pattern for teams adopting this approach?

This positions the project as **infrastructure**, not just a demo.
