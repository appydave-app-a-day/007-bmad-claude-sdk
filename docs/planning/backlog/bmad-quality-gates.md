---
title: BMAD Quality Gates Integration
purpose: Future enhancement - SDK hooks for BMAD workflow enforcement
status: backlog
requires: BMAD Method v6+ capabilities
when_to_implement: After v6 workflow-init and agent system is available
---

# BMAD Quality Gates (Future Enhancement)

**Status**: Deferred to future version - requires BMAD Method v6

**Current Reality**: BMAD Method v4 does not have workflow-init, track selection, or agent-based workflows. These are v6 features.

---

## Concept

Integrate BMAD workflow discipline into the Claude Agent SDK through custom hooks that enforce story-driven development during the self-editing application's operation.

### Quality Gate Hook Implementation

Before allowing file writes, verify ACTIVE_STORY.md exists:

```typescript
const hooks = {
  async beforeToolCall(ctx: any) {
    if (ctx.toolName === 'write_file') {
      const activeStory = await fs.readFile(
        'bmad/bmm/stories/ACTIVE_STORY.md'
      ).catch(() => null);

      if (!activeStory) {
        throw new Error(
          'No ACTIVE_STORY.md - create story before coding'
        );
      }
    }
  }
};
```

### Integration Point

Add hooks to the Agent SDK configuration:

```typescript
const agent = new Agent({
  name: 'ProductBuilder',
  systemPrompt: `...`,
  tools: [read_json, write_json, write_file],
  hooks // BMAD quality gate
});
```

---

## Use Cases

### During Development (Epics 1-3)
- Enforces story-driven development while building the framework
- Prevents code changes without active story context
- Maintains BMAD discipline throughout implementation

### During Self-Editing (Post-Development)
- **Optional**: Could enforce that user conversations create stories first
- **Example**: "Before adding blog feature, create story-005-blog-system.md"
- **Trade-off**: Adds friction to conversational development

---

## Why Deferred

1. **BMAD v4 Limitation**: Current BMAD Method doesn't have workflow-init or agent system
2. **Scope Creep**: Adds complexity to educational demo
3. **User Experience**: May hinder the "conversational magic" of self-editing
4. **Version Confusion**: Documentation mixed v4 and v6 concepts

---

## Future Considerations

### When BMAD v6 is Available

**Workflow Path**:
1. `npx bmad-method install` (v6)
2. `*workflow-init` with Mary (Analyst agent)
3. Track selection (Quick Flow / Full Method / Enterprise)
4. `*tech-spec` with PM agent (John)
5. Generate stories and architecture
6. Quality gate hooks enforce active story during implementation

### Integration Benefits

**During Framework Build**:
- Story-driven epic development (Epic 1 → 2 → 3)
- Quality gates prevent unauthorized changes
- PRD and architecture artifacts maintained
- Acceptance criteria validation

**During Self-Editing**:
- Application can update its own PRD as features are added
- Agent creates story files for new features conversationally
- Code quality validation using Claude Code agent
- Full BMAD self-management ("BMAD builds BMAD-aware tools")

### Demonstration Value

The recursive beauty: **BMAD builds the framework → The framework enforces BMAD → Application self-documents its evolution**

---

## Implementation Guide (When Ready)

### Step 1: Install BMAD v6
```bash
npx bmad-method install  # Ensures v6 with agent support
```

### Step 2: Workflow Initialization
```bash
*workflow-init  # Mary (Analyst) guides through setup
```

**Pre-answered questions** (from bmad-execution-guide.md):
- Project name: "BMAD + Claude SDK Self-Editing App"
- Project state: Greenfield (new project)
- Track: Quick Flow (implementation-focused)

### Step 3: Tech-Spec Generation
```bash
*tech-spec  # PM agent (John) creates stories
```

**Reference materials**:
- project-reference.md (complete specification)
- tech-stack.md (technology decisions)
- video-strategy.md (epic structure)

### Step 4: Add Quality Gate Hook

Modify `server.ts` to include BMAD hook:

```typescript
import fs from 'node:fs/promises';
import path from 'node:path';

const hooks = {
  async beforeToolCall(ctx: any) {
    if (ctx.toolName === 'write_file' || ctx.toolName === 'write_json') {
      const activeStoryPath = path.join(
        process.cwd(),
        'bmad/bmm/stories/ACTIVE_STORY.md'
      );

      try {
        await fs.access(activeStoryPath);
      } catch {
        throw new Error(
          'No ACTIVE_STORY.md found. Create a story before making changes.\n' +
          'Run: *create-story to generate a new story file.'
        );
      }
    }
  }
};

const agent = new Agent({
  name: 'ProductBuilder',
  systemPrompt: systemPromptContent,
  tools: [read_json, write_json, write_file],
  hooks  // BMAD quality gate enforcement
});
```

### Step 5: Enhanced System Prompt

Update agent system prompt to be BMAD-aware:

```typescript
const systemPrompt = `
You are a careful site generator integrated with BMAD Method.

BMAD Integration:
- Before creating new features, check if bmad/bmm/stories/ACTIVE_STORY.md exists
- You can read PRD at bmad/bmm/docs/prd.md for project context
- When adding significant features, suggest creating a story file first
- Update PRD when features expand beyond original scope

Available Tools:
- read_json(filepath) - Read JSON from /data directory
- write_json(filepath, content) - Write JSON to /data directory
- write_file(filepath, content) - Write HTML/CSS/JS to /public directory

...rest of prompt
`;
```

---

## Alternative: Lightweight Quality Gates (No v6 Required)

If BMAD v6 is not available but you want some discipline:

### Manual Story Creation
User creates story files before conversational development:

```
User: "Before we add the blog feature, let me create a story"
User: *Creates docs/stories/story-005-blog-system.md manually*
User: *Sets ACTIVE_STORY.md to point to story-005*
User: "Now add blog system with 5 posts"
Agent: *Checks for ACTIVE_STORY, proceeds with blog creation*
```

### Simplified Hook (v4 Compatible)

```typescript
// Simple BMAD-inspired quality gate (no v6 required)
const hooks = {
  async beforeToolCall(ctx: any) {
    // Just check if any story exists (not full BMAD workflow)
    const storiesDir = path.join(process.cwd(), 'docs/stories');
    try {
      const stories = await fs.readdir(storiesDir);
      if (stories.length === 0) {
        console.warn('No stories found - consider creating story files for discipline');
      }
    } catch {
      console.warn('No stories directory - working in undisciplined mode');
    }
  }
};
```

---

## References

**Original Planning Documents** (Mixed v4/v6):
- bmad-execution-guide.md - Detailed workflow-init and tech-spec Q&A
- project-reference.md - Quality gate hook examples
- CLAUDE.md - Workflow initialization instructions

**BMAD Documentation**:
- BMAD Method v4: https://github.com/bmad-code-org/BMAD-METHOD
- Curated docs: `/Users/davidcruwys/dev/ad/brains/bmad-method/`

**When to Revisit**: When BMAD Method v6 is publicly released with agent system and workflow-init capabilities.

---

**Last Updated**: 2025-11-14
**Status**: Preserved for future implementation
**Version Required**: BMAD Method v6+
