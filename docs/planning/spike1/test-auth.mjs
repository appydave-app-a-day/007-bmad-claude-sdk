#!/usr/bin/env node

/**
 * SPIKE: Test Agent SDK Authentication Flow
 *
 * Purpose: Determine the correct story order for Epic 2
 * Question: Does SDK require auth BEFORE use, or discover auth is needed?
 *
 * Test Scenarios:
 * 1. No authentication at all → What error?
 * 2. With ANTHROPIC_API_KEY → Does it work?
 * 3. With claude auth login → Does it work?
 */

import { query } from '@anthropic-ai/claude-agent-sdk';

console.log("═══════════════════════════════════════════════════════════");
console.log("SPIKE: Agent SDK Authentication Flow Test");
console.log("═══════════════════════════════════════════════════════════\n");

// Check environment
console.log("Environment Check:");
console.log("─────────────────────────────────────────────────────────");
console.log("ANTHROPIC_API_KEY:", process.env.ANTHROPIC_API_KEY ? "SET (hidden)" : "NOT SET");
console.log("CLAUDE_API_KEY:", process.env.CLAUDE_API_KEY ? "SET (hidden)" : "NOT SET");
console.log("HOME/.claude exists:", await checkClaudeAuth());
console.log("Running from:", process.cwd());
console.log("");

async function checkClaudeAuth() {
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    const os = await import('os');
    const claudeDir = path.default.join(os.default.homedir(), '.claude');
    await fs.access(claudeDir);
    return "YES";
  } catch {
    return "NO";
  }
}

console.log("Test: Attempting to use Agent SDK...");
console.log("─────────────────────────────────────────────────────────\n");

try {
  let messageReceived = false;
  const startTime = Date.now();

  for await (const message of query({
    prompt: "Respond with just 'authenticated'",
    options: { maxTurns: 1 }
  })) {
    messageReceived = true;
    const elapsed = Date.now() - startTime;

    console.log("✅ SUCCESS - SDK worked without errors");
    console.log(`Time: ${elapsed}ms`);
    console.log("");

    if (message.apiKeySource) {
      console.log("Authentication Source:", message.apiKeySource);
    }

    if (message.type) {
      console.log("Message Type:", message.type);
    }

    console.log("");
    console.log("═══════════════════════════════════════════════════════════");
    console.log("CONCLUSION:");
    console.log("═══════════════════════════════════════════════════════════");
    console.log("The SDK successfully authenticated and responded.");
    console.log("");
    console.log("This means authentication WAS available via:");
    if (process.env.ANTHROPIC_API_KEY) {
      console.log("  ✓ ANTHROPIC_API_KEY environment variable");
    }
    if (await checkClaudeAuth() === "YES") {
      console.log("  ✓ ~/.claude/ directory (claude auth login)");
    }
    console.log("");
    console.log("Story Order Implication:");
    console.log("Since authentication must exist BEFORE the SDK can work,");
    console.log("Story 2.4 (Configure Authentication) should come BEFORE");
    console.log("Story 2.5 (Integrate SDK).");
    console.log("═══════════════════════════════════════════════════════════");

    break;
  }

  if (!messageReceived) {
    console.log("⚠️  No response received (possible timeout)");
  }

} catch (error) {
  console.log("❌ ERROR - SDK failed to authenticate");
  console.log("");
  console.log("Error Details:");
  console.log("─────────────────────────────────────────────────────────");
  console.log("Name:", error.name);
  console.log("Message:", error.message);
  console.log("");

  // Check if it's an authentication error
  const isAuthError =
    error.message.toLowerCase().includes('auth') ||
    error.message.toLowerCase().includes('api key') ||
    error.message.toLowerCase().includes('unauthorized') ||
    error.message.toLowerCase().includes('invalid') ||
    error.message.toLowerCase().includes('401');

  console.log("═══════════════════════════════════════════════════════════");
  console.log("CONCLUSION:");
  console.log("═══════════════════════════════════════════════════════════");

  if (isAuthError) {
    console.log("This IS an authentication error.");
    console.log("");
    console.log("The SDK requires authentication BEFORE it can work.");
    console.log("It does NOT work first and then tell you to authenticate.");
    console.log("");
    console.log("Story Order Conclusion:");
    console.log("✓ Story 2.4 (Configure Authentication) MUST come BEFORE");
    console.log("  Story 2.5 (Integrate SDK)");
    console.log("");
    console.log("User Flow:");
    console.log("1. Install Claude CLI");
    console.log("2. Run 'claude auth login'");
    console.log("3. THEN integrate and use the SDK");
  } else {
    console.log("This is NOT an authentication error.");
    console.log("Something else went wrong.");
    console.log("");
    console.log("Full error:");
    console.error(error);
  }

  console.log("═══════════════════════════════════════════════════════════");

  process.exit(1);
}
