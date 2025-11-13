# Authentication Flow Spike

## Purpose

Determine the correct story order for Epic 2 by testing what happens when the Agent SDK is used without authentication.

## Question

Does the Agent SDK:
- **A) Require authentication BEFORE use** (Story 2.4 → 2.5)
- **B) Discover authentication is needed and prompt** (Story 2.5 → 2.4)

## Setup Instructions

**IMPORTANT: Run this OUTSIDE of Claude Code to get accurate results.**

### 1. Install Dependencies

```bash
cd spike-auth-flow
npm install
```

### 2. Test Scenario 1: No Authentication

Remove ALL authentication sources:

```bash
# Temporarily rename auth directory
mv ~/.claude ~/.claude-hidden

# Make sure no API key in environment
unset ANTHROPIC_API_KEY
unset CLAUDE_API_KEY

# Run test
npm test
```

**Expected Result:**
- If SDK requires auth first: Error message about missing authentication
- If SDK discovers auth needed: SDK tries to run, then prompts for auth

### 3. Test Scenario 2: With API Key

```bash
# Set API key (get from https://console.anthropic.com/)
export ANTHROPIC_API_KEY=your_key_here

# Run test
npm test
```

**Expected Result:** SDK should work

### 4. Test Scenario 3: With Claude CLI Auth

```bash
# Restore auth directory
mv ~/.claude-hidden ~/.claude

# Unset API key
unset ANTHROPIC_API_KEY

# Run test
npm test
```

**Expected Result:** SDK should work using ~/.claude/ session

### 5. Restore Everything

```bash
# Make sure auth directory is restored
mv ~/.claude-hidden ~/.claude 2>/dev/null || true
```

## Results

Record results here:

**Scenario 1 (No Auth):**
- Error Type:
- Error Message:
- Conclusion:

**Scenario 2 (API Key):**
- Success:
- Auth Source:

**Scenario 3 (Claude CLI):**
- Success:
- Auth Source:

## Epic 2 Story Order Decision

Based on test results:

- [ ] Story 2.4 (Auth) BEFORE Story 2.5 (SDK) - SDK requires auth first
- [ ] Story 2.5 (SDK) BEFORE Story 2.4 (Auth) - SDK discovers auth needed

## Notes

- This spike must be run OUTSIDE Claude Code environment
- Claude Code injects `CLAUDE_ACCESS_TOKENV_*` environment variables
- Testing from within Claude Code gives false results
