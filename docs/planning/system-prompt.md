# System Prompt Evolution

**Purpose**: The system prompt is the highest-leverage customization point for the Claude SDK agent. This file tracks the prompt and its evolution.

---

## Current System Prompt

```javascript
// server.js - Agent configuration
const agent = new Agent({
  name: 'MiniClaudeDev',
  systemPrompt: `
You are a careful site generator helping build a self-modifying web application.

You can:
- read_json / write_json to manage ./data/products.json
- write_file to create or update pages in /public/

Rules:
- Use Tailwind CDN classes for all HTML styling
- Product listing page: grid of products with links to /product-{slug}.html
- Product detail page: title, price, description, attributes, back link to listing
- Landing page: hero section + 3 featured/promoted products
- Never write files outside /public or /data directories
- Always return a friendly summary of what you changed

You are building ONE evolving application, not separate apps.
Keep all changes consistent with the existing application structure.
  `.trim(),
  tools: [read_json, write_json, write_file],
  hooks
});
```

---

## Evolution Log

### 2025-10-27 - Initial Prompt
**Context**: First version for self-modifying product catalog demo.

**Key elements**:
- Identity: "careful site generator"
- Capability: Three custom tools (read_json, write_json, write_file)
- Constraints: Tailwind only, sandbox to /public and /data
- Output: Friendly summaries

**Decisions**:
- Emphasized "ONE evolving application" to prevent agent from treating each request as separate project
- Specific page patterns (listing, detail, landing) to guide consistent structure
- "Never write outside" for safety

---

## Guidelines for Prompt Updates

### What Belongs in System Prompt

✅ **Agent identity**: What role is it playing?
✅ **Available capabilities**: What tools can it use? (brief, tools are defined elsewhere)
✅ **Domain constraints**: What framework/patterns must it follow? (e.g., Tailwind)
✅ **Safety rules**: What must it never do?
✅ **Output format**: What should responses look like?
✅ **Context**: Any critical framing (e.g., "ONE evolving application")

### What Does NOT Belong

❌ **Detailed implementation**: Code samples, complex algorithms
❌ **Data examples**: Specific product structures (that's in data files)
❌ **Tool documentation**: Detailed tool schemas (defined in tool objects)
❌ **Transient state**: Current story, specific file names

### When to Update

**Add to prompt when**:
- Agent consistently misunderstands core concept
- New safety constraint discovered
- New pattern emerges that should be standard
- Framework/library changes (e.g., switch from Tailwind)

**Don't update for**:
- One-off corrections
- Temporary experiments
- User-specific preferences

---

## Skills Integration Considerations

### Question: Do skills affect system prompt?

**SKILL 1** (A/B UI Generator):
- Runs in Stage 2 (vibe coding context)
- Same agent, same system prompt
- Might need: "When generating variations, create in /ab-test/ subfolder with documentation"

**SKILL 2** (BMAD Story Generator):
- Runs in Stage 1 (Claude Code context)
- Different context entirely
- Separate system prompt? Or extension of main prompt?

**TODO**: Investigate if skills need:
1. Separate prompts per skill
2. Metadata that modifies base prompt
3. Conditional prompt sections

---

## Future Considerations

### Potential Additions

**Date context**:
```
Current date: {YYYY-MM-DD}
```
Prevents "cutoff/date hallucinations" when discussing recent events.

**Enhanced data handling**:
```
When enhancing data structures:
- Preserve existing fields
- Add new fields with sensible defaults
- Update all affected pages to reflect new structure
```

**Error handling**:
```
If an operation fails:
- Explain what went wrong
- Suggest what the user should check
- Don't retry automatically
```

### Overwrite vs Append Strategy

**Current**: Full custom prompt (overwrite Claude Code's default)

**Alternative**: Append to Claude Code's base prompt
```javascript
systemPrompt: CLAUDE_CODE_BASE_PROMPT + `
Additionally, for this domain:
...custom rules...
`
```

**Decision for v1**: Stick with full custom (simpler, more explicit).

**Reconsider if**: We want general Claude Code capabilities (git, complex refactoring) alongside domain-specific rules.

---

## Notes

- Keep prompt concise - every token multiplies across every turn
- Test prompt changes with representative user requests
- Document why each major change was made
- Prefer specific constraints over vague guidance
