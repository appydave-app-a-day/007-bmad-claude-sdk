---
title: System Prompt
purpose: Agent behavior configuration for Claude SDK in self-editing application
audience: Epic 1 implementation agents
when_to_read: Implementing Epic 1 server setup, configuring Claude SDK agent
key_sections: [The Prompt, Design Principles, Product-Specific Focus]
status: active
---

# System Prompt for Self-Editing Application

---

## The Prompt

```
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
```

---

## Why This Prompt?

**Identity**: "careful site generator"
- Frames the agent's role clearly
- Emphasizes caution (not reckless generation)

**Capabilities**: Lists the 3 custom tools
- Agent knows what it can do
- Brief (tools are defined separately)

**Rules**: Specific constraints
- Tailwind only (consistent styling)
- Specific page patterns (guides structure)
- Safety: "Never write outside /public or /data"
- User experience: "friendly summary"

**Key Framing**: "ONE evolving application"
- Prevents agent from treating each request as a separate project
- Encourages consistency across changes

---

## Design Principles

### What Belongs in System Prompt

✅ Agent identity (what role is it playing?)
✅ Available capabilities (what tools can it use?)
✅ Domain constraints (what framework/patterns must it follow?)
✅ Safety rules (what must it never do?)
✅ Output format (what should responses look like?)
✅ Context (critical framing like "ONE evolving application")

### What Does NOT Belong

❌ Detailed implementation (code samples, complex algorithms)
❌ Data examples (specific product structures - that's in data files)
❌ Tool documentation (detailed tool schemas - defined in tool objects)
❌ Transient state (current story, specific file names)

---

## Product-Specific Focus

**Why hardcoded for products?**

This is what we're demonstrating in Epic 3. The prompt guides the agent to:
- Create product data structures
- Generate product listing pages
- Generate product detail pages
- Build landing pages with featured products

This is a **capability of the self-editing application** - the agent understands the domain it's working in.

---

## Future: Skills Integration (Reach Goal)

If Claude SKILLS are added to the project:

**SKILL 1** (A/B UI Generator):
- Runs in the same agent context
- Might need: "When generating variations, create in /ab-test/ subfolder with documentation"

**SKILL 2** (BMAD Story Generator):
- Runs in different context (Claude Code)
- Would need separate or modified prompt

**Status**: Not implemented in v1, documented for future exploration

**See**: `future/skills-design.md` for complete SKILLS specification

---

## Usage in Code

See `agent-event-loop/dsl-reference.md` for implementation examples showing how this prompt is configured in the agent initialization.

---

## Notes

- Keep prompt concise (every token multiplies across every turn)
- Test prompt changes with representative user requests
- Prefer specific constraints over vague guidance
- This prompt is part of Epic 1 implementation
