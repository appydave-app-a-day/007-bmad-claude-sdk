# AppyDave Workflow - Complete Reference Guide

**Purpose**: Semi-automated BMAD v4 story lifecycle workflow with human-in-loop gates

**Created**: 2025-11-16
**Last Updated**: 2025-11-16
**BMAD Version**: v4 Stable
**Workflow Type**: Sequential execution with human approval gates

---

## Recent Changes

### 2025-11-16 - Version 1.2

**Automated Story Closure** (Step 6) - NEW! 🎉:
- When QA review passes, workflow now **automatically closes the story**
- Updates Status from "Review" to "Done"
- Marks all incomplete tasks as completed (`[ ]` → `[x]`)
- Adds completion timestamp to QA Results section
- Saves updated story file
- **No manual intervention required!**

### 2025-11-16 - Version 1.1

**Smart Story Discovery** (Step 0):
- Workflow now automatically discovers the next story number
- Finds highest existing story file, checks its status
- Suggests next story if current is Done
- Warns if current story is incomplete
- Falls back to 1.1 if no stories exist

**QA Process Clarification** (Step 6):
- QA agent now updates story file's "QA Results" section (not separate doc)
- Creates gate file at `docs/qa/gates/{epic}.{story}-{slug}.yml`
- Gate file contains PASS/CONCERNS/FAIL/WAIVED decision
- Added guardrails against creating separate QA markdown files

**Reference**: See commit d4b0a84 for QA fix details

---

## Quick Start

### How to Invoke

**Option 1: Claude Code Slash Command** (Recommended for video)
```bash
cd /path/to/007-bmad-claude-sdk
claude
> /appydave-workflow
Which story number do you want to work on? [Suggested: 2.4]
> 2.4  # Or press Enter to accept suggestion
```

**Option 2: Via BMAD Master Agent**
```
BMad Master: *execute-task execute-appydave-workflow
Which story number do you want to work on? [Suggested: 2.4]
> 2.4  # Or press Enter to accept suggestion
```

**Option 3: Via BMAD Orchestrator**
```
BMad Orchestrator: *execute-task execute-appydave-workflow
Which story number do you want to work on? [Suggested: 2.4]
> 2.4  # Or press Enter to accept suggestion
```

**Smart Story Discovery**: The workflow automatically finds your highest story file, checks its status, and suggests the next logical story number. If the current story isn't Done, it warns you first.

---

## Workflow Overview

### The 6-Step Process

```
Step 1: Story Creation (SM) → Status: Draft
   ↓
Step 2: Story Validation (PO) → GO/NO-GO [OPTIONAL]
   ↓
Step 3: Status Change (Human) → Draft → Ready [REQUIRED]
   ↓
Step 4: Development (Dev) → Ready → Review
   ↓
Step 5: Acceptance Testing (SAT) → Create + Execute Tests [REQUIRED]
   ↓
Step 6: QA Review (QA) → Review → Done
```

### State Transitions

```
Draft → Ready → In Progress → Review → Done
  ↑       ↑          ↑           ↑        ↑
Step 1  Step 3     Step 4       Step 4   Step 6
 (SM)   (Human)     (Dev)        (Dev)    (QA)
```

---

## Step-by-Step Breakdown

### Step 1: Story Creation (SM Agent)

**Agent**: Scrum Master (Bob) 🏃
**File**: `.bmad-core/agents/sm.md`
**Command**: `*draft-story`
**Task**: `create-next-story.md`

#### What Happens
1. Loads core configuration from `core-config.yaml`
2. Identifies next story number in sequence
3. Reads epic requirements from PRD (sharded or monolithic)
4. Reads architecture documents based on story type
5. Reviews previous story's Dev Agent Record (if exists)
6. Creates comprehensive story file with:
   - User story statement
   - 10+ acceptance criteria
   - Tasks/subtasks breakdown
   - Dev Notes (embedded technical context)
   - Testing instructions
   - Definition of Done checklist
7. Sets initial status: **Draft**

#### Output
- **File**: `docs/stories/{epic}.{story}.story.md`
- **Status**: Draft
- **Size**: ~200-400 lines (self-contained)

#### HALT Point
```
✅ Story 2.4 created successfully!
📄 File: docs/stories/2.4.story.md
📊 Status: Draft

Please review the story file to ensure acceptance criteria and tasks are clear.

Options:
- Type 'go' to proceed to validation
- Type 'skip' to skip validation and go to status change
- Type 'exit' to stop workflow
```

#### Behind the Scenes
- SM agent reads 4-8 architecture files to gather context
- Embeds technical context in "Dev Notes" section
- Links tasks to specific acceptance criteria
- Uses template: `story-tmpl.yaml`
- Follows sequential task execution (9 steps)

---

### Step 2: Story Validation (PO Agent) [OPTIONAL]

**Agent**: Product Owner (Sarah) 📝
**File**: `.bmad-core/agents/po.md`
**Command**: `*validate-story-draft`
**Task**: `validate-next-story.md`

#### What Happens
1. Loads story file from Step 1
2. Loads parent epic from PRD
3. Loads architecture documents (for verification)
4. Runs **10 validation checks**:
   - ✅ Template completeness (all sections present)
   - ✅ File structure clarity (paths, directories)
   - ✅ UI/Frontend completeness (if applicable)
   - ✅ Acceptance criteria satisfaction
   - ✅ Validation/testing instructions
   - ✅ Security considerations
   - ✅ Task sequence logic
   - ✅ Anti-hallucination verification (no invented details)
   - ✅ Dev agent implementation readiness
   - ✅ Self-contained context check
5. Generates validation report with 3 issue levels:
   - **Critical** (Must fix - story blocked)
   - **Should-Fix** (Important quality improvements)
   - **Nice-to-Have** (Optional enhancements)

#### Output
- **Validation Report**: GO ✅ or NO-GO ❌
- **Implementation Readiness Score**: 1-10
- **Confidence Level**: High/Medium/Low

#### HALT Point (If GO)
```
✅ Validation complete for Story 2.4

Final Assessment: GO ✅
Implementation Readiness Score: 9/10
Confidence Level: High

Story is ready for development!

Type 'go' to proceed to status change gate.
```

#### HALT Point (If NO-GO)
```
❌ Validation complete for Story 2.4

Final Assessment: NO-GO ❌

Critical Issues Found:
- Missing file path specifications in Task 3
- Acceptance Criteria 7 is not testable
- Security considerations not addressed

Please fix these issues before proceeding.
Type 'exit' to stop workflow and address issues.
```

#### Behind the Scenes
- PO reads 10+ files to cross-reference
- Validates every technical claim traces to architecture
- Checks for SM hallucinations (invented libraries, APIs)
- Ensures Dev won't need to search for missing context
- Sequential 10-step validation process

---

### Step 3: Status Change Gate (Human Action) [REQUIRED]

**Agent**: None (Human performs this)
**File**: Story file itself
**Action**: Manual edit

#### What Happens
1. Workflow displays file path (clickable link)
2. User opens story file in editor
3. User changes Status field from "Draft" to "Ready"
4. User saves file
5. User returns to workflow and types 'verify' or 'go'

#### Why This Gate Exists
- **Human Approval**: Ensures you've reviewed and approved story
- **Quality Control**: Prevents auto-proceeding to expensive dev step
- **Conscious Decision**: You explicitly authorize development to begin

#### HALT Point
```
⚠️  HUMAN ACTION REQUIRED

Please manually change the story status:
📄 File: docs/stories/2.4.story.md
📝 Action: Change Status from "Draft" to "Ready"

This manual step ensures you've reviewed and approved the story.

Options:
- Type 'verify' to check if status has been changed
- Type 'go' to proceed (assumes you've changed it)
```

#### Verification (If user types 'verify')
```
# Workflow reads file and checks Status field

✅ Status confirmed as Ready. Type 'go' to proceed.

OR

❌ Status is still 'Draft'. Please change to 'Ready' first.
```

#### Behind the Scenes
- No agent context loaded (saves tokens)
- Simple file read/write operation
- Acts as conscious approval checkpoint

---

### Step 4: Development (Dev Agent)

**Agent**: Dev (Alex) 💻
**File**: `.bmad-core/agents/dev.md`
**Command**: `*develop-story`
**Task**: Implementation workflow (story-driven)

#### Pre-Check
1. Read story file
2. Verify Status = "Ready"
3. If not Ready: **HALT** with error

#### What Happens
1. Loads story file (all context embedded in Dev Notes)
2. Reads project structure and existing code
3. Implements each task sequentially:
   - Creates/modifies files
   - Writes code following coding standards
   - Adds tests (unit, integration, E2E as specified)
   - Updates documentation
   - Handles error cases
4. Updates story file during implementation:
   - Checks off completed tasks
   - Adds Dev Agent Record notes
   - Documents deviations from plan
   - Logs challenges and solutions
5. Changes status: **Ready → In Progress → Review**
6. Commits code (if git workflow enabled)

#### Output
- **Code**: All files created/modified per story tasks
- **Tests**: Unit tests, integration tests
- **Status**: Review
- **Dev Notes**: Implementation decisions documented

#### HALT Point
```
✅ Development complete for Story 2.4!

📊 Implementation Summary:
- Files created: 3
- Files modified: 2
- Tests added: 8
- Status: Review

📄 Story file: docs/stories/2.4.story.md

Type 'go' to proceed to acceptance testing.
```

#### Behind the Scenes
- Dev reads 15-25 files during implementation
- Follows TDD if specified in testing strategy
- Uses story's embedded context (doesn't search architecture)
- Runs tests after each significant change
- Updates story file incrementally (tasks checked off)
- Logs every deviation in Dev Agent Record

---

### Step 5: Acceptance Testing (SAT Agent)

**Agent**: Story Acceptance Test (Taylor) 📋
**File**: `.bmad-core/agents/sat.md`
**Command**: `*create-sat`
**Task**: `create-sat.md`

#### What Happens
1. **Reads TWO sources**:
   - Story file (acceptance criteria, requirements)
   - Actual implementation code (what was ACTUALLY built)
2. Creates comprehensive test guide: `{story}.story-SAT.md`
3. Separates tests into 2 categories:
   - **🧑 Human Tests**: Visual verification (browser, UI, logs, observable behavior)
   - **🤖 Terminal Tests**: Scriptable commands (curl, CLI, file checks)
4. Includes for each test:
   - Prerequisites
   - Step-by-step instructions
   - Expected results
   - Actual file paths, URLs, commands
5. Adds troubleshooting section
6. Adds test tracking checklist

#### Output
- **File**: `docs/stories/{story}.story-SAT.md`
- **Human Tests**: 5-10 tests (browser, visual)
- **Terminal Tests**: 5-10 tests (curl, scripts)

#### Example SAT Guide Content
```markdown
# Story 2.4: Acceptance Tests

## Prerequisites
- Server running: `npm run dev`
- Database seeded: `npm run db:seed`

## 🧑 Human Tests

### Test 1: Verify Login Page UI
1. Open browser: http://localhost:3000/login
2. Check for email input field
3. Check for password input field
4. Check "Login" button exists
Expected: All elements visible, properly styled

### Test 2: Verify Error Message Display
1. Leave email blank
2. Click "Login" button
3. Observe error message
Expected: Red error message "Email is required"

## 🤖 Terminal Tests

### Test 1: Health Check Endpoint
```bash
curl http://localhost:3000/api/health
```
Expected: `{"status":"ok"}`

### Test 2: Login Endpoint (Valid Credentials)
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```
Expected: `{"token":"...", "user":{...}}`
```

#### HALT Point
```
✅ Story Acceptance Test guide created!

📄 Test Guide: docs/stories/2.4.story-SAT.md

⚠️  HUMAN TESTING REQUIRED

Please execute the tests manually:
1. Open the SAT guide file
2. Run all Human Tests (visual verification in browser)
3. Run all Terminal Tests (curl commands, scripts)
4. Document PASS/FAIL results in the SAT file

When all tests are executed and results documented, type 'go' for QA review.
```

#### Behind the Scenes
- SAT reads story file (12 acceptance criteria)
- SAT reads actual code (event-loop.ts, server.ts, etc.)
- Creates tests for what EXISTS, not what was PLANNED
- Uses real file paths, actual endpoints, working commands
- Designs for non-technical users (clear instructions)
- Not unit testing - acceptance criteria validation

---

### Step 6: QA Review (QA Agent)

**Agent**: QA (Quinn) 🧪
**File**: `.bmad-core/agents/qa.md`
**Command**: `*review-story`
**Task**: `review-story.md`

#### What Happens
1. Loads story file (acceptance criteria, requirements)
2. Reviews actual implementation code
3. Reviews test files and coverage
4. **Reads SAT results** (from Step 5)
5. Executes Definition of Done checklist
6. **Updates the story file**:
   - Adds results to the "QA Results" section in the story file
   - Does NOT create a separate QA markdown document
   - Only modifies the QA Results section (leaves other sections intact)
7. **Creates QA gate file**: `docs/qa/gates/{epic}.{story}-{slug}.yml` with:
   - Code quality assessment
   - Test coverage analysis
   - SAT results verification
   - Acceptance criteria satisfaction
   - Security/performance considerations
   - Bug history (if fixes were needed)
   - Overall quality score (0-100)
   - Gate decision: PASS/CONCERNS/FAIL/WAIVED

#### Output
- **Story file updated**: `docs/stories/{epic}.{story}.story.md` (QA Results section)
- **Gate file created**: `docs/qa/gates/{epic}.{story}-{slug}.yml`
- **Gate Status**: PASS ✅ / CONCERNS ⚠️ / FAIL ❌ / WAIVED 🔀
- **Quality Score**: 0-100
- **Issues**: List of defects/improvements needed

#### Critical Notes
- **DO NOT** create a separate `{story}.story-QA.md` file
- **DO NOT** simulate QA with general-purpose agent
- **ONLY** update the "QA Results" section of the story file
- Gate file is the YAML report, story file gets the summary

#### Automated Story Closure (If PASS)
When QA review passes, the workflow **automatically**:
1. Updates story Status from "Review" to "Done"
2. Marks all incomplete tasks as completed (`[ ]` → `[x]`)
3. Adds completion timestamp to QA Results section
4. Saves the updated story file

**No manual intervention required** - the story is fully closed!

#### HALT Point (If PASS)
```
✅ QA Review PASSED for Story 2.4!

📋 QA Summary:
- Code Quality: ✅
- Test Coverage: ✅ (95%)
- SAT Results: ✅ (12/12 tests PASS)
- Acceptance Criteria: ✅ (10/10 met)
- Overall Score: 95/100

🎉 Story 2.4 is now complete!

📝 Automated Story Closure:
- Status updated: Review → Done ✅
- All tasks marked complete ✅
- Completion timestamp added ✅
- Story file saved ✅

Options:
- Type 'next' to start workflow for next story (2.5)
- Type 'exit' to end workflow
```

#### HALT Point (If FAIL)
```
❌ QA Review FAILED for Story 2.4

📋 Issues Found:
1. Test coverage below 80% (current: 65%)
2. SAT Test 3 failed: Login button not working
3. Acceptance Criteria 7 not fully implemented
4. Security: No input validation on email field

Quality Score: 70/100

Options:
- Type 'dev' to return to development (Step 4)
- Type 'exit' to stop and fix issues manually
```

#### Behind the Scenes
- QA reads 20+ files (code, tests, SAT results)
- Runs automated code quality checks
- Cross-references SAT results with acceptance criteria
- Documents bug history if fixes were needed
- Assigns quality score based on multiple factors
- Creates YAML report for audit trail
- Can trigger return to Dev if issues found

---

## All Agents Involved

### 1. Scrum Master (Bob) 🏃
- **Role**: Story creation specialist
- **Persona**: Organized, detail-oriented, facilitator
- **Commands**: `*draft-story`, `*create-next-story`
- **Key Task**: `create-next-story.md` (9 sequential steps)
- **Output**: Comprehensive story file with embedded context

### 2. Product Owner (Sarah) 📝
- **Role**: Story validation expert
- **Persona**: Quality-focused, user-centric, acceptance authority
- **Commands**: `*validate-story-draft`, `*validate-next-story`
- **Key Task**: `validate-next-story.md` (10 validation checks)
- **Output**: Validation report with GO/NO-GO decision

### 3. Dev Agent (Alex) 💻
- **Role**: Code implementation specialist
- **Persona**: Pragmatic, test-driven, quality-conscious
- **Commands**: `*develop-story`, `*implement-story`
- **Key Task**: Story-driven implementation workflow
- **Output**: Working code, tests, documentation

### 4. SAT Agent (Taylor) 📋
- **Role**: Acceptance test guide creator
- **Persona**: Methodical, user-focused, clarity-driven
- **Commands**: `*create-sat`, `*update-sat`
- **Key Task**: `create-sat.md` (9 steps)
- **Output**: Test guide with Human + Terminal tests

### 5. QA Agent (Quinn) 🧪
- **Role**: Final quality gate reviewer
- **Persona**: Thorough, quality-obsessed, test architect
- **Commands**: `*review-story`, `*test-review`
- **Key Task**: `review-story.md` (with DoD checklist)
- **Output**: QA gate report (PASS/FAIL)

---

## Human Gates & Decisions

### Gate 1: Validation (Optional)
- **When**: After Step 1 (Story Creation)
- **Decision**: Continue to validation OR skip to status change
- **Impact**: Quality assurance before dev starts

### Gate 2: Status Change (Required)
- **When**: After Step 2 (or after Step 1 if skipped)
- **Action**: Manually change Draft → Ready
- **Impact**: Explicit approval to proceed to development

### Gate 3: Manual Testing (Required)
- **When**: After Step 5 (SAT guide created)
- **Action**: Execute all Human + Terminal tests
- **Impact**: Verification that implementation meets acceptance criteria

### Gate 4: QA Decision (Final)
- **When**: After Step 6 (QA review)
- **Decision**: Accept (mark Done) OR reject (return to Dev)
- **Impact**: Story completion or rework

---

## Files Created Throughout Workflow

### By SM Agent (Step 1)
```
docs/stories/2.4.story.md              # Story file (Draft)
```

### By Dev Agent (Step 4)
```
src/features/login/LoginForm.tsx       # Example implementation files
src/features/login/login.service.ts
src/features/login/login.test.ts
docs/stories/2.4.story.md              # Updated (Review status)
```

### By SAT Agent (Step 5)
```
docs/stories/2.4.story-SAT.md          # Test guide
```

### By QA Agent (Step 6)
```
docs/qa/gates/2.4-login-feature.yml    # QA gate report
```

---

## Workflow Timing (Typical)

| Step | Agent | Time | Can Skip? |
|------|-------|------|-----------|
| 1. Story Creation | SM | 5-10 min | No |
| 2. Validation | PO | 10-15 min | Yes |
| 3. Status Change | Human | 1 min | No |
| 4. Development | Dev | 2-4 hours | No |
| 5. SAT Creation | SAT | 5-10 min | No |
| 5. SAT Execution | Human | 15-30 min | No |
| 6. QA Review | QA | 10-20 min | No |

**Total**: ~3-5 hours per story (includes human testing time)

---

## Key Features

### Sequential Execution
- ✅ No race conditions from typing ahead
- ✅ Each step must complete before next begins
- ✅ HALT points enforce human confirmation

### Human-in-Loop
- ✅ Optional validation gate (skip if confident)
- ✅ Required status change (conscious approval)
- ✅ Required manual testing (hands-on verification)
- ✅ Final QA decision (quality gate)

### Self-Contained
- ✅ Story files embed all necessary context
- ✅ Dev doesn't search for missing information
- ✅ SAT tests actual implementation (not theory)
- ✅ QA has complete audit trail

### Safety Features
- ✅ Status verification before proceeding
- ✅ Clickable file path links
- ✅ Clear HALT messages
- ✅ Error recovery options
- ✅ Can return to Dev if QA fails

---

## Usage Patterns

### Pattern 1: Full Quality (Recommended for critical stories)
```
Step 1: SM creates → 'go'
Step 2: PO validates → 'go'
Step 3: Human changes status → 'go'
Step 4: Dev implements → 'go'
Step 5: SAT creates + Human tests → 'go'
Step 6: QA reviews → 'next' (if PASS)
```

### Pattern 2: Fast Track (For simple/low-risk stories)
```
Step 1: SM creates → 'skip'
Step 3: Human changes status → 'go'
Step 4: Dev implements → 'go'
Step 5: SAT creates + Human tests → 'go'
Step 6: QA reviews → 'next' (if PASS)
```

### Pattern 3: Interrupted (Resume anytime)
```
Step 1: SM creates → 'exit'
[Later: Resume at Step 2]
Step 2: PO validates → 'go'
[Continue from where you left off]
```

---

## Behind the Scenes: What Makes This Work

### 1. Template-Driven Workflow
- All agents use YAML templates (`story-tmpl.yaml`, `qa-gate-tmpl.yaml`)
- Ensures consistency across stories
- Provides structure for agent outputs

### 2. Embedded Context
- SM agent embeds technical context in story's "Dev Notes"
- Dev doesn't need to search architecture docs
- Self-contained story files reduce token usage

### 3. State Management via File System
- Story status field drives workflow progression
- No external database needed
- Simple, auditable, version-controlled

### 4. Sequential Task Execution Pattern
- All BMAD tasks follow "Do not proceed until current step complete"
- Natural HALT points between steps
- Human confirmation required to advance

### 5. Cross-Agent Handoffs
- Each agent enriches the story file
- Next agent reads previous agent's work
- Audit trail preserved in file history

---

## Troubleshooting

### "Story status is not 'Ready'"
**Problem**: Tried to skip Step 3 (status change)
**Solution**: Go back and manually change status to "Ready"

### "Validation report says NO-GO"
**Problem**: Story has critical issues
**Solution**: Type 'exit', fix issues, re-run workflow from Step 1

### "QA review FAILED"
**Problem**: Implementation has defects
**Solution**: Type 'dev' to return to Step 4, fix issues, re-run from there

### "Can't find SAT agent"
**Problem**: SAT agent not installed
**Solution**: Ensure `.bmad-core/agents/sat.md` and `.bmad-core/tasks/create-sat.md` exist

---

## Comparison to Manual Workflow

### Before AppyDave Workflow (Manual)
```
1. Open new terminal → Load SM → *draft-story
   [Wait for completion]
2. Open new terminal → Load PO → *validate-story-draft
   [Wait for completion]
3. Manually edit status field
4. Open new terminal → Load Dev → *develop-story
   [Wait for completion - could type ahead and break things]
5. Open new terminal → Load SAT → *create-sat
   [Wait for completion]
6. Manually run tests
7. Open new terminal → Load QA → *review-story
   [Race conditions possible from typing ahead]
```

### With AppyDave Workflow (Automated)
```
1. /appydave-workflow 2.4
   [Workflow handles all agent loading]
   [Type 'go' at each HALT point]
   [No race conditions - enforced sequential execution]
   [All in one conversation context]
```

**Time Saved**: ~10-15 minutes of context switching
**Errors Prevented**: Race conditions from typing ahead
**Convenience**: Single command, guided workflow

---

## Implementation Files

### BMAD Task File
**Location**: `.bmad-core/tasks/execute-appydave-workflow.md`
**Purpose**: The actual workflow task that BMAD agents execute
**Usage**: `BMad Master: *execute-task execute-appydave-workflow`

### Claude Code Slash Command
**Location**: `.claude/commands/appydave-workflow.md`
**Purpose**: Slash command wrapper for easy invocation
**Usage**: `/appydave-workflow`

---

**Created**: 2025-11-16
**Author**: David Cruwys (AppyDave)
**BMAD Version**: v4 Stable
**License**: Proprietary - AppyDave Brand
