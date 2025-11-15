/**
 * Minimal test to verify Claude Agent SDK is working
 * Run with: npx tsx test-sdk.ts
 *
 * Based on SDK exports: query, tool, createSdkMcpServer
 */

import { query } from '@anthropic-ai/claude-agent-sdk';

async function testSDK() {
  console.log('🧪 Testing Claude Agent SDK...\n');
  console.log('📤 Sending query: "Say hello in exactly 5 words"\n');

  try {
    let responseText = '';
    let messageCount = 0;

    // Use the query export (stateless, simple API)
    for await (const message of query({
      prompt: 'Say hello in exactly 5 words',
      options: {
        systemPrompt: 'You are helpful and concise.',
        maxTurns: 1
      }
    })) {
      messageCount++;
      console.log(`\n📨 Message #${messageCount}:`, JSON.stringify(message, null, 2));

      // Collect the response content
      // Handle wrapped message structure: { type: "assistant", message: { content: [...] } }
      if (message && typeof message === 'object') {
        let content = null;

        // Check if content is directly on message
        if ('content' in message) {
          content = message.content;
        }
        // Check if it's wrapped in a 'message' property
        else if ('message' in message && typeof message.message === 'object' && 'content' in message.message) {
          content = message.message.content;
        }

        // Parse the content
        if (Array.isArray(content)) {
          for (const block of content) {
            if (block && typeof block === 'object' && 'text' in block) {
              responseText += block.text;
            }
          }
        } else if (typeof content === 'string') {
          responseText += content;
        }
      }
    }

    console.log(`\n📊 Total messages received: ${messageCount}`);

    console.log('📥 Response received:');
    console.log('─'.repeat(50));
    console.log(responseText || '(no text response)');
    console.log('─'.repeat(50));

    if (!responseText) {
      console.log('\n⚠️  WARNING: No text response received!');
      console.log('The SDK executed without errors, but Claude did not respond.');
      console.log('This suggests either:');
      console.log('  1. Authentication is not properly configured');
      console.log('  2. The API call is being made but returns empty');
      console.log('  3. We are not parsing the response correctly\n');
      process.exit(1);
    } else {
      console.log('\n✅ SDK is ACTUALLY working! Got real response from Claude!\n');
    }

  } catch (error: any) {
    console.error('❌ SDK Test Failed:');
    console.error('Error:', error.message);

    if (error.stack) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }

    if (error.message?.includes('authentication') ||
        error.message?.includes('auth') ||
        error.message?.includes('login')) {
      console.error('\n💡 Try running: claude auth login');
    }

    process.exit(1);
  }
}

testSDK();
