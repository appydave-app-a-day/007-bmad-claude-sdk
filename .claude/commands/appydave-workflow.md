---
description: Execute AppyDave's full BMAD v4 story workflow with human-in-loop gates
---

# AppyDave Workflow Command

You are orchestrating AppyDave's complete BMAD v4 story lifecycle workflow. This command guides a story from creation through QA review with human approval gates at critical decision points.

## CRITICAL INSTRUCTIONS

**SEQUENTIAL EXECUTION ONLY**:
- Execute steps ONE AT A TIME
- ALWAYS HALT and wait for user confirmation before proceeding to next step
- Do NOT load multiple agents simultaneously
- Do NOT skip ahead to later steps
- User must explicitly type 'continue', 'skip', or other specified commands to proceed

**HUMAN-IN-LOOP GATES**:
- Story validation (optional)
- Status change from Draft → Ready (required)
- Manual acceptance testing (required)
- QA review decision (required)

---

## Workflow Steps

### Step 0: Initialize

Ask user: "Which story number do you want to work on? (e.g., 2.3)"

Store the story number for use throughout the workflow.

---

### Step 1: Story Creation

**Agent**: Load Scrum Master (SM) agent

**Action**: Run `*draft-story` command for the specified story number

**After story is created**:
- Display story file path (make it clickable)
- Show current status (should be "Draft")

**STOP and display**:
```
✅ Story {number} created successfully!
📄 File: docs/stories/{number}.story.md
📊 Status: Draft

Please review the story file to ensure acceptance criteria and tasks are clear.

Options:
- Type 'continue' to proceed to validation
- Type 'skip' to skip validation and go to status change
- Type 'exit' to stop workflow
```

**Wait for user input**: `continue`, `skip`, or `exit`

---

### Step 2: Story Validation (Optional)

**Only execute if user typed 'continue' in Step 1**

**Agent**: Load Product Owner (PO) agent

**Action**: Run `*validate-story-draft {story-number}` command

**After validation completes**:
- Display validation summary (Critical/Should-Fix/Nice-to-Have issues)
- Show GO/NO-GO decision

**STOP and display (if GO)**:
```
✅ Validation complete for Story {number}

Final Assessment: GO ✅
Implementation Readiness Score: {score}/10

Story is ready for development!

Type 'continue' to proceed to status change gate.
```

**STOP and display (if NO-GO)**:
```
❌ Validation complete for Story {number}

Final Assessment: NO-GO ❌

Critical Issues Found:
{list issues}

Please fix these issues before proceeding.
Type 'exit' to stop workflow and address issues.
```

**Wait for user input**: `continue` or `exit`

---

### Step 3: Status Change Gate (REQUIRED HUMAN ACTION)

**No agent needed** - This is a manual human step

**STOP and display**:
```
⚠️  HUMAN ACTION REQUIRED

Please manually change the story status:
📄 File: docs/stories/{number}.story.md
📝 Action: Change Status from "Draft" to "Ready"

This manual step ensures you've reviewed and approved the story.

Options:
- Type 'verify' to check if status has been changed
- Type 'continue' to proceed (assumes you've changed it)
```

**If user types 'verify'**:
- Read the story file
- Check the Status field
- If "Ready": Display "✅ Status confirmed as Ready. Type 'continue' to proceed."
- If not "Ready": Display "❌ Status is still '{current}'. Please change to 'Ready' first."

**Wait for user input**: `verify` or `continue`

---

### Step 4: Development

**Agent**: Load Dev agent

**Pre-check**: Verify story status is "Ready" (read file and check)
- If not Ready: HALT with error "Story status is not 'Ready'. Cannot proceed."

**Action**: Run `*develop-story {story-number}` command

**After development completes**:
- Show summary (files created, tests added)
- Confirm status changed to "Review"

**STOP and display**:
```
✅ Development complete for Story {number}!

📊 Implementation Summary:
- Status: Review
- Story file: docs/stories/{number}.story.md

Type 'continue' to proceed to acceptance testing.
```

**Wait for user input**: `continue`

---

### Step 5: Acceptance Testing (SAT)

**Agent**: Load Story Acceptance Test (SAT) agent

**Action**: Run `*create-sat {story-number}` command

**After SAT guide is created**:
- Display SAT file path (make it clickable)
- Explain that human must execute tests manually

**STOP and display**:
```
✅ Story Acceptance Test guide created!

📄 Test Guide: docs/stories/{number}.story-SAT.md

⚠️  HUMAN TESTING REQUIRED

Please execute the tests manually:
1. Open the SAT guide file
2. Run all Human Tests (visual verification in browser)
3. Run all Terminal Tests (curl commands, scripts)
4. Document PASS/FAIL results in the SAT file

When all tests are executed and results documented, type 'continue' for QA review.
```

**Wait for user input**: `continue`

---

### Step 6: QA Review (Final Gate)

**Agent**: Load QA agent (Quinn from `.bmad-core/agents/qa.md`)

**Action**: Run `*review {story-number}` command

**CRITICAL - What the QA agent does**:
1. Reads and follows `.bmad-core/tasks/review-story.md` task
2. Reviews the story file (`docs/stories/{story-number}.story.md`)
3. Updates ONLY the "QA Results" section in the story file
4. Creates a gate file at `docs/qa/gates/{epic}.{story}-{slug}.yml`
5. Gate file contains PASS/CONCERNS/FAIL/WAIVED decision with score

**DO NOT**:
- Create a separate QA markdown document
- Simulate the QA agent with general-purpose agent
- Modify any other sections of the story file

**After QA review completes**:
- Read the gate file to get the decision and score
- Read the story file QA Results section for summary
- Display decision to user

**STOP and display (if PASS)**:
```
✅ QA Review PASSED for Story {number}!

📋 QA Summary:
- Code Quality: ✅
- Test Coverage: ✅
- SAT Results: ✅
- Overall Score: {score}/100

🎉 Story {number} is complete and ready to be marked Done!

Options:
- Type 'next' to start workflow for next story
- Type 'exit' to end workflow
```

**STOP and display (if FAIL)**:
```
❌ QA Review FAILED for Story {number}

Issues found:
{list of issues}

Options:
- Type 'dev' to return to development (Step 4)
- Type 'exit' to stop and fix issues manually
```

**Wait for user input**: `next`, `exit`, or `dev`

---

## Error Handling

**If user types unexpected input**:
- Display: "Invalid input. Please choose from: {list valid options for current step}"
- Re-display the current HALT point message

**If file not found**:
- Display clear error with expected file path
- Suggest corrective action
- Offer to retry or exit

**If agent fails to load**:
- Display: "Failed to load {agent-name} agent. Please check .bmad-core/agents/ directory."
- Halt workflow

---

## State Transitions

```
Draft → Ready → In Progress → Review → Done
  ↑       ↑          ↑           ↑        ↑
Step 1  Step 3     Step 4       Step 4   Step 6
 (SM)   (Human)     (Dev)        (Dev)    (QA)
```

---

## Example Usage

```bash
# In your terminal
cd /path/to/project
claude

# Run AppyDave's workflow command
> /appydave-workflow

# Claude asks: "Which story number?"
> 2.3

# Workflow begins at Step 1
# Follow prompts, type 'continue' at each gate
```

---

## Notes

- This workflow prevents race conditions by enforcing sequential execution
- Each HALT point requires explicit user confirmation
- Human gates ensure critical review happens at right moments
- Workflow state persists in file system (story status field)
- Compatible with BMAD v4 agent architecture

---

**Created**: 2025-11-16
**BMAD Version**: v4
**Workflow Type**: Semi-automated with human gates
