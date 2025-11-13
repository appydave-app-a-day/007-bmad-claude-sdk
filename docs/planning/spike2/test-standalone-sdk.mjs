// Test: What happens in a STANDALONE Node.js server (NOT in Claude Code environment)
// This simulates what server.ts will experience

import { query } from '@anthropic-ai/claude-agent-sdk';

console.log("=== STANDALONE SDK AUTHENTICATION TEST ===\n");
console.log("Simulating: User runs 'npm run dev' to start server.ts");
console.log("Environment: Standalone Node.js (NOT inside Claude Code)\n");

// Clear any Claude Code environment variables to simulate standalone
const originalEnv = { ...process.env };
delete process.env.CLAUDE_CODE_SESSION_ID;
delete process.env.CLAUDE_API_KEY;
delete process.env.ANTHROPIC_API_KEY;

console.log("Environment check:");
console.log("- ANTHROPIC_API_KEY:", process.env.ANTHROPIC_API_KEY || 'NOT SET');
console.log("- CLAUDE_API_KEY:", process.env.CLAUDE_API_KEY || 'NOT SET');
console.log("- CLAUDE_CODE_SESSION_ID:", process.env.CLAUDE_CODE_SESSION_ID || 'NOT SET');
console.log("\nAttempting to use SDK without explicit authentication...\n");

try {
  const startTime = Date.now();
  let responseReceived = false;

  for await (const message of query({
    prompt: "Hello, respond with just 'yes'",
    options: { maxTurns: 1 }
  })) {
    responseReceived = true;
    const elapsed = Date.now() - startTime;

    console.log(`✅ SUCCESS after ${elapsed}ms`);
    console.log("SDK worked without requiring 'claude auth login' first\n");

    if (message.apiKeySource) {
      console.log("Authentication source:", message.apiKeySource);
    }

    console.log("\n=== CONCLUSION ===");
    console.log("The SDK can be used BEFORE running 'claude auth login'");
    console.log("Story order: 2.5 (SDK integration) can come BEFORE 2.4 (authentication)");
    break;
  }

  if (!responseReceived) {
    console.log("⚠️  No response received (timeout or error)");
  }

} catch (error) {
  console.log("❌ ERROR: SDK failed\n");
  console.log("Error name:", error.name);
  console.log("Error message:", error.message);

  if (error.stack) {
    console.log("\nStack trace (first 5 lines):");
    console.log(error.stack.split('\n').slice(0, 5).join('\n'));
  }

  console.log("\n=== CONCLUSION ===");

  if (error.message.toLowerCase().includes('auth') ||
      error.message.toLowerCase().includes('api key') ||
      error.message.toLowerCase().includes('unauthorized')) {
    console.log("✓ Authentication IS required BEFORE using SDK");
    console.log("✓ Story order is CORRECT: 2.4 (auth) must come BEFORE 2.5 (SDK)");
    console.log("\nExpected flow:");
    console.log("1. User installs SDK (Story 2.4: Install Claude CLI)");
    console.log("2. User runs 'claude auth login' (Story 2.4)");
    console.log("3. SDK can now authenticate via CLI session (Story 2.5)");
  } else {
    console.log("⚠️  Error is NOT authentication-related");
    console.log("Need to investigate further");
  }
}

// Restore environment
process.env = originalEnv;
