# BMAD v6-Alpha Video Demo - Action Plan

**Project**: Self-Editing Claude SDK App with BMAD Integration
**Video Date**: 2025-11-12
**Planning Track**: Quick Flow (Full Path - including UX Designer)

---

## 📋 Pre-Recording Checklist

- [ ] Planning docs reviewed (8 docs in `docs/planning/`)
- [ ] BMAD v6-alpha installed and working (`npx bmad-method@alpha install`)
- [ ] Test all BMAD commands work (`*workflow-init`, `*workflow-status`, etc.)
- [ ] Verify planning docs are accessible to agents
- [ ] Project directory clean (no old BMAD artifacts)

---

## 🎬 Video Recording Script

### **INTRO** (30 seconds)

**On Screen**: Terminal in project root
**Say**:
> "Today I'm demonstrating BMAD v6-alpha - the BMad Method's complete rewrite with modular architecture. I'll show you a realistic workflow: taking existing planning documents and formalizing them into BMAD's structure for a self-editing web app using Claude SDK."

**Project Context**:
> "This app demonstrates Claude's self-editing capabilities - it can modify its own code, data, and pages using three simple tools: read_json, write_json, and write_file. All protected by path validation and a BMAD quality gate."

---

### **STEP 0: Project Initialization** (2 minutes)

**Command**: `*workflow-init`

**On Screen**: Show initialization prompts

**Questions & Answers**:
```
> What are you building?
"Self-editing web application using Claude SDK with BMAD integration.
Express server with three tools allowing Claude to modify JSON data and
HTML pages. Uses Claude CLI OAuth authentication."

> Which planning track?
"Quick Flow - this is a focused demo app, not a full platform"

> Any additional context?
"I have 8 detailed planning documents in docs/planning/ covering
architecture, security, skills design, and video strategy."
```

**Say While Running**:
> "workflow-init is BMAD's entry point. It helps you choose the right planning track. For this demo app, Quick Flow is perfect - we get a tech-spec without the overhead of full architecture documentation."

**Command**: `*workflow-status`

**Say**:
> "workflow-status is your compass - it shows where you are and what's next. Notice it's recommending I start with Analysis phase."

**Expected Output**:
```
Project initialized
Track: Quick Flow
Current Phase: Setup complete
Recommended Next: *product-brief (Analysis phase)
```

---

### **STEP 1: Product Brief with Analyst/Mary** (5 minutes)

**Command**: Load `bmad/bmm/agents/analyst.md`

**Say**:
> "Mary is the Analyst - she gathers requirements and creates product briefs. Instead of starting from scratch, I'm going to leverage my existing research."

**Prompt to Mary**:
```
Create a product brief for this self-editing Claude SDK application.

I have extensive planning documents in docs/planning/:

1. **project-reference.md** - Complete project overview, architecture, and goals
2. **system-prompt.md** - Core self-editing concept and Claude's system instructions
3. **skills-design.md** - Three tools design (read_json, write_json, write_file)
4. **security-considerations.md** - Path validation and safety mechanisms
5. **agent-instructions.md** - How Claude should interact with the system
6. **video-strategy.md** - Demo goals and educational objectives
7. **visual-concepts.md** - UI/UX considerations
8. **youtube-title-thumbnail.md** - Content strategy

Please synthesize these into a BMAD-formatted product brief focusing on:
- The self-editing capability demonstration
- Security constraints (path validation, safe() function)
- BMAD integration (ACTIVE_STORY.md as quality gate)
- Educational value for the video
- Technical constraints (Claude CLI OAuth, Express ~200 LOC)
```

**Say While Mary Works**:
> "This is the power of BMAD - it doesn't replace your research, it formalizes it. Mary is reading through all my planning docs and synthesizing them into a structured product brief that the rest of the team can work from."

**After Completion**:
> "Notice Mary created a product brief in docs/planning/product-brief.md. She's captured the vision, goals, success criteria, and constraints. This becomes the foundation for everything else."

**Command**: `*workflow-status`

**Say**:
> "workflow-status now shows I've completed Analysis. Next up: Planning phase with John."

**Expected Output**:
```
Product brief complete
Current Phase: Analysis ✓
Recommended Next: *tech-spec (Planning phase)
```

---

### **STEP 2: Tech Spec with PM/John** (5-7 minutes)

**Command**: Load `bmad/bmm/agents/pm.md`

**Say**:
> "John is the Project Manager. In Quick Flow, he creates a lightweight tech-spec instead of a full PRD. He's going to reference Mary's product brief and my existing technical docs."

**Prompt to John**:
```
Create a Quick Flow tech-spec based on Mary's product brief and the technical
planning documents in docs/planning/.

Key technical details to incorporate:
- Express server architecture (~200 LOC target)
- Three-tool system: read_json, write_json, write_file
- Data layer: ./data/products.json (sample data)
- Pages layer: ./public/*.html (UI pages)
- Security layer: path validation, safe() wrapper function
- BMAD integration: ACTIVE_STORY.md as quality gate before commits
- Authentication: Claude CLI OAuth (not API key)

Focus on:
1. System architecture overview
2. Security boundaries
3. BMAD workflow integration
4. Success criteria for the demo

Reference docs/planning/security-considerations.md and
docs/planning/skills-design.md for technical constraints.
```

**Say While John Works**:
> "Quick Flow means John skips the full PRD and goes straight to a focused tech-spec. He's defining WHAT we're building and HOW it fits together. For this demo, that's the Express server, the three tools, and how BMAD gates the self-editing."

**After Completion**:
> "John created docs/planning/tech-spec.md. Notice he's broken down the technical approach, identified the key components, and called out the security boundaries. This is what Bob and Amelia will use to create stories."

**Command**: `*workflow-status`

**Say**:
> "Planning phase complete. In Quick Flow, we skip Architecture docs - the tech-spec has what we need. But we're adding UX design because this is a visual demo."

**Expected Output**:
```
Tech-spec complete
Current Phase: Planning ✓
Track: Quick Flow
Recommended Next: *assess-project-ready OR *create-story
Optional: UX Designer review for UI/demo apps
```

---

### **STEP 3: UX Design with Sally** (4-5 minutes)

**Say**:
> "Normally Quick Flow skips UX, but this is a video demo with visual components. Sally will help design the UI for maximum educational impact."

**Command**: Load `bmad/bmm/agents/ux-designer.md`

**Prompt to Sally**:
```
Review the tech-spec and create UX design guidelines for this demo application.

Context:
- This is an educational video demo (20-30 min YouTube video)
- Goal: Show Claude's self-editing capabilities clearly
- Audience: Developers learning about AI agents and tool use
- UI needs to make the self-editing visible and understandable

Reference docs:
- docs/planning/visual-concepts.md - Initial UI ideas
- docs/planning/video-strategy.md - Educational objectives
- docs/planning/tech-spec.md - Technical constraints

Focus on:
1. How to visualize the three tools (read_json, write_json, write_file)
2. How to show the BMAD quality gate (ACTIVE_STORY.md check)
3. How to display the products data in an editable way
4. Visual feedback when Claude makes changes
5. Clean, minimal UI that doesn't distract from the concept

Create:
- UI wireframes/descriptions
- Visual design guidelines
- Interaction patterns for the demo
```

**Say While Sally Works**:
> "Sally is the UX Designer. She's thinking about how to make the self-editing visible and compelling on video. The UI needs to show what Claude is doing without overwhelming the viewer."

**After Completion**:
> "Sally created docs/planning/ux-design.md with wireframes and interaction patterns. She's designed a clean interface that highlights the three tools and shows the BMAD quality gate in action. This will make the video much more engaging."

**Command**: `*workflow-status`

**Say**:
> "UX design complete. Now we're ready for implementation - time for Bob and Amelia."

**Expected Output**:
```
UX design complete
Current Phase: Solutioning ✓
Recommended Next: *assess-project-ready
```

---

### **STEP 4: Story Creation with SM/Bob** (3-4 minutes)

**Say**:
> "Bob is the Story Manager. He's going to assess if we're ready for implementation, then create development stories based on John's tech-spec and Sally's UX design."

**Command**: `*assess-project-ready`

**Say While Running**:
> "assess-project-ready is Bob's preflight check. He verifies we have planning docs and they're complete enough to start coding. In Quick Flow, he's looking for the tech-spec and optionally UX design."

**Expected Output**:
```
✓ Tech-spec found and complete
✓ UX design found and complete
✓ Ready for story creation
```

**Command**: `*create-story`

**Say**:
> "create-story is NON-INTERACTIVE in BMAD v6. Bob reads the planning docs and creates draft stories automatically. Watch."

**Say While Running**:
> "Bob is analyzing the tech-spec and breaking it into implementable stories. He's creating stories in docs/stories/ with acceptance criteria based on John's requirements and Sally's UX guidelines."

**After Completion**:
> "Bob created multiple stories - one for the Express server, one for the three tools, one for the security layer, one for the UI, and one for BMAD integration. Each story has clear acceptance criteria."

**Command**: `*workflow-status`

**Say**:
> "Stories created and in BACKLOG state. Let's mark the first story ready and assemble its context."

**Expected Output**:
```
Stories: 5 created (BACKLOG)
Current Phase: Implementation
Recommended Next: *story-ready, *story-context, *develop
```

---

### **STEP 5: Story Context Assembly** (2-3 minutes)

**Say**:
> "Before Amelia can develop, Bob needs to assemble the story context. This is CRITICAL - it gathers all relevant docs, code, and context into one place."

**Command**: `*story-ready`

**Prompt**:
```
Mark story "Setup Express server with three-tool system" as ready
```

**Say**:
> "story-ready moves a story from BACKLOG to TODO. Now it's ready for context assembly."

**Command**: `*story-context`

**Say**:
> "This is where the magic happens. story-context reads the story, the tech-spec, the UX design, the product brief, and assembles everything Amelia needs into a single context file."

**Say While Running**:
> "Bob is gathering:
> - The story description and acceptance criteria
> - John's tech-spec for architectural guidance
> - Sally's UX design for UI requirements
> - Mary's product brief for project goals
> - Any existing code context
> - BMAD patterns and best practices
>
> All of this goes into ACTIVE_STORY.md - Amelia's complete context."

**After Completion**:
> "ACTIVE_STORY.md created. This file contains everything needed to implement the story. Amelia doesn't need to hunt for context - it's all right here."

**Command**: `*workflow-status`

**Say**:
> "Story context assembled. Story is now IN PROGRESS. Ready for Amelia."

**Expected Output**:
```
Active story: Setup Express server with three-tool system
Status: IN PROGRESS (context assembled)
Context: ACTIVE_STORY.md
Recommended Next: *develop
```

---

### **STEP 6: Development with Dev/Amelia** (5-7 minutes)

**Say**:
> "Amelia is the Developer. She implements stories using the context Bob assembled. In BMAD v6, *develop runs continuously - Amelia keeps working until the story is complete."

**Command**: Load `bmad/bmm/agents/dev.md`

**Prompt to Amelia**:
```
Implement the current story using ACTIVE_STORY.md as your context.

Key requirements from the story:
- Express server (~200 LOC target)
- Three tools: read_json, write_json, write_file
- Path validation and safe() wrapper
- Serves static pages from ./public/
- API endpoints for the tools
- BMAD quality gate integration

Before any commits:
1. Check ACTIVE_STORY.md exists and is current
2. Verify acceptance criteria are met
3. Only commit if quality gate passes

Let me know when you need my input, otherwise work continuously.
```

**Say While Amelia Works**:
> "Notice Amelia's workflow - she reads ACTIVE_STORY.md, implements code, tests it, and checks the quality gate before committing. She works continuously but pauses for critical decisions."

**Show on Screen**:
- Amelia creating files (server.js, tools implementation, public/index.html)
- Running code to test
- Checking ACTIVE_STORY.md before commits
- Making iterative improvements

**Say**:
> "This is realistic development - Amelia makes mistakes, fixes them, iterates. The difference is she's guided by BMAD's context assembly and quality gates."

**After Implementation**:
> "Story complete! Amelia implemented the Express server, all three tools with path validation, the UI, and the BMAD quality gate. She committed code only after verifying ACTIVE_STORY.md was accurate."

**Command**: `*story-done`

**Say**:
> "story-done marks the story as DONE and cleans up ACTIVE_STORY.md. Bob and Amelia are ready for the next story."

---

### **STEP 7: Demo the Self-Editing App (Claude Agent SDK)**

**Say**:
> "Now the moment of truth - let's see the self-editing app in action. This is the Claude Agent SDK app we just built. It starts with just a text box."

**Command**: `npm start` (or appropriate command)

**On Screen**: Show the web UI - simple page with text box

**Demo Flow (Agent SDK App Interface)**:
1. **Start with empty text box** - show the minimal interface
2. **Type in text box**: "Create 3 products with name, price, description and save to data/products.json"
3. **Watch Agent SDK work**:
   - Show Claude Agent SDK using `read_json` tool
   - Show Claude Agent SDK using `write_json` tool
   - **Quality gate**: Backend checks ACTIVE_STORY.md exists (show in logs/terminal)
4. **Verify**: Show data/products.json was created
5. **Type in text box**: "Generate an HTML page showing all products at /products.html"
6. **Watch Agent SDK work**:
   - Agent reads products.json
   - Agent uses `write_file` tool
   - **Quality gate**: Backend checks ACTIVE_STORY.md before writing
7. **Verify**: Open /products.html in browser
8. **Type in text box**: "Modify the products page to use a card layout instead of a table"
9. **Watch Agent SDK work**:
   - Agent uses `write_file` tool to update
   - Show the change in browser

**Say**:
> "This is the self-editing app - Claude modifying its own data and pages through conversation. Notice the BMAD integration - the backend's beforeToolCall hook checks ACTIVE_STORY.md exists before any write operations. This quality gate prevents scope creep."

**If something fails**:
> "And here's where it gets real - when things break, we go back to BMAD to fix it. Let me show you..."

*→ Proceed to STEP 8*

---

### **STEP 8: Fix Issues & Document Learnings (OPTIONAL - If Demo Fails)**

**Say**:
> "When the Agent SDK app fails, this is where BMAD shines - we use it to fix bugs and document learnings."

**Workflow**:
1. **Switch back to Claude Code**
2. **Load Dev / Amelia** (or appropriate agent)
3. **Prompt**: "The Agent SDK app is failing when [describe issue]. Fix it and test."
4. **Amelia fixes the bug** using BMAD workflow
5. **Load Technical Writer / Daniel**
6. **Prompt to Daniel**:
   ```
   Document the learnings from this Agent SDK failure.

   What failed: [specific issue]
   Root cause: [what we discovered]
   Fix applied: [code changes]

   Create documentation in docs/learnings/agent-sdk-issues.md that helps
   future developers avoid this issue. Include code examples.
   ```

**Say While Daniel Works**:
> "Daniel is the Technical Writer. He's documenting what went wrong and how we fixed it. This creates institutional knowledge - future developers won't hit the same issue."

**After Completion**:
> "Now we have both a working app AND documentation of the journey. That's realistic development - problems happen, BMAD helps you fix them AND learn from them."

**Then**: Return to demo (Step 7) and show it working

---

### **WRAP-UP**

**Command**: `*workflow-status`

**Say**:
> "workflow-status shows our progress - one story DONE, four stories remaining in backlog. This is BMAD's iterative workflow."

**Expected Output**:
```
Project: Quick Flow
Stories: 1 DONE, 4 BACKLOG
Current Phase: Implementation (iterative)
Recommended Next: *story-ready (next story)
```

**Say**:
> "What we've demonstrated:
> - BMAD v6-alpha's modular architecture
> - Realistic workflow using existing planning docs (not magic #yolo)
> - workflow-init and workflow-status for navigation
> - Four agents collaborating: Mary, John, Sally, Bob, Amelia
> - Story context assembly (CRITICAL for quality)
> - Continuous development with quality gates
> - Self-editing app with BMAD integration
>
> This is BMAD Method v6 - AI-driven agile development that formalizes your research, structures your planning, and guides your implementation.
>
> Links in description. Thanks for watching!"

---

## 📝 Video Production Notes

### Talking Points Themes

1. **BMAD is a formalizer, not a replacer** - It structures existing research
2. **workflow-status is your compass** - Always know where you are
3. **Story context is critical** - Bob assembles everything Amelia needs
4. **Quality gates prevent chaos** - ACTIVE_STORY.md keeps work focused
5. **Realistic workflow beats magic** - Showing real docs is more educational than #yolo

### Key Differences from Brain Version

This action plan is:
- **Project-specific**: References actual planning docs in docs/planning/
- **Script-like**: Formatted for video recording with talking points (no time pressure)
- **Execution-focused**: Not educational reference, but actual recording guide
- **Demo-driven**: Includes Agent SDK app demonstration (self-editing via text box)
- **Full path**: Includes Sally (UX Designer) for complete workflow
- **Reality-based**: Includes optional Technical Writer step if demo fails

### Technical Details to Highlight

**Self-Editing Architecture**:
- Express server ~200 LOC
- Three tools: read_json, write_json, write_file
- Data: ./data/products.json
- Pages: ./public/*.html
- Security: path validation, safe() wrapper
- Auth: Claude CLI OAuth (not API key)

**BMAD Integration**:
- ACTIVE_STORY.md as quality gate
- Claude checks before making changes
- Prevents scope creep
- Maintains story focus

### B-Roll Opportunities

- Close-ups of workflow-status output
- ACTIVE_STORY.md content
- Planning docs in docs/planning/
- Code being written
- Quality gate checks
- UI updating in real-time

### Common Issues & Solutions

**If workflow-init fails**:
- Check BMAD v6-alpha is installed: `npx bmad-method@alpha install`
- Verify in correct directory

**If story-context is incomplete**:
- Ensure tech-spec exists in docs/planning/
- Check UX design was created
- Verify product brief is complete

**If develop stalls**:
- Check ACTIVE_STORY.md exists and is current
- Verify acceptance criteria are clear
- Provide Amelia with additional context if needed

**If Agent SDK demo fails**:
- **Don't panic** - this is realistic development
- Switch to Step 8 (Fix Issues with BMAD)
- Use Technical Writer / Daniel to document learnings
- Show the fix, then retry the demo
- This demonstrates BMAD's debugging workflow

---

## ✅ Post-Recording Checklist

- [ ] Video demonstrates workflow-init
- [ ] Video shows workflow-status transitions
- [ ] Mary references planning docs (not #yolo)
- [ ] John creates tech-spec
- [ ] Sally creates UX design (full path)
- [ ] Bob assembles story context
- [ ] Amelia implements with quality gates
- [ ] **App demo shows Agent SDK self-editing** (text box → products → HTML)
- [ ] **BMAD quality gate visible** (ACTIVE_STORY.md check in backend logs)
- [ ] **(Optional) Daniel documents learnings** if issues occurred
- [ ] Wrap-up summarizes key points

---

**Created**: 2025-11-11
**Video Target**: 2025-11-12
**BMAD Version**: v6.0.0-alpha.8
**Project**: Self-Editing Claude SDK App with BMAD Integration
