// Test: What happens when we try to use Agent SDK without authentication?
import { query } from '@anthropic-ai/claude-agent-sdk';

console.log("Testing Agent SDK without authentication...\n");
console.log("Attempting to query SDK...\n");

try {
  let responseReceived = false;

  for await (const message of query({
    prompt: "Hello, can you respond with just 'yes'?",
    options: { maxTurns: 1 }
  })) {
    responseReceived = true;
    console.log("SUCCESS: Agent SDK responded without requiring authentication setup first");
    console.log("Message received:", message);
    break;
  }

  if (!responseReceived) {
    console.log("No response received");
  }

} catch (error) {
  console.log("ERROR: Agent SDK failed");
  console.log("Error type:", error.constructor.name);
  console.log("Error message:", error.message);
  console.log("\n=== CONCLUSION ===");

  if (error.message && error.message.includes('auth')) {
    console.log("Authentication is required BEFORE using the SDK");
    console.log("The SDK does NOT work first and then tell you to authenticate");
  } else {
    console.log("Error is NOT related to authentication");
    console.log("Full error:", error);
  }
}
