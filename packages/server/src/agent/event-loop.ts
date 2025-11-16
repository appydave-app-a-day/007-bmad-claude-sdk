/**
 * Agent Event Loop
 *
 * This is the core event loop that handles user messages and returns agent responses.
 *
 * Story 2.2: Basic synchronous event loop (no streaming)
 * Story 2.3: Will add streaming support
 * Stories 2.4-2.6: Will register tools
 */

import { createQuery, getAgentOptions } from './agent-config.js';
import { logger } from '../utils/logger.js';

/**
 * Handle user message and return agent response
 *
 * This function:
 * 1. Receives a user message
 * 2. Calls the Agent SDK
 * 3. Returns the complete response (synchronous, no streaming yet)
 *
 * @param message - The user's message content
 * @param messageId - Unique identifier for tracking this message
 * @returns Promise<string> - The complete agent response
 */
export const handleUserMessage = async (
  message: string,
  messageId: string
): Promise<string> => {
  try {
    // Log receipt of user message
    logger.info('Received user message', {
      component: 'AgentEventLoop',
      messageId,
      messagePreview: message.substring(0, 100),
    });

    // Call Agent SDK with the user's message (synchronous, no streaming yet)
    logger.info('Calling Agent SDK', { component: 'AgentEventLoop', messageId });

    const queryIterator = createQuery(message);

    // Extract response text from SDK result
    // The SDK returns an async generator with wrapped message structure
    let responseText = '';
    for await (const chunk of queryIterator) {
      // Handle wrapped message structure: { type: "assistant", message: { content: [...] } }
      if (chunk && typeof chunk === 'object') {
        let content = null;

        // Check if content is directly on chunk
        if ('content' in chunk) {
          content = chunk.content;
        }
        // Check if it's wrapped in a 'message' property
        else if ('message' in chunk && typeof chunk.message === 'object' && 'content' in chunk.message) {
          content = chunk.message.content;
        }

        // Parse the content array to extract text
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

    logger.info('Agent responded', {
      component: 'AgentEventLoop',
      messageId,
      responsePreview: responseText.substring(0, 100),
    });

    return responseText;
  } catch (error) {
    // Log error with stack trace for debugging
    logger.error('Agent processing failed', {
      component: 'AgentEventLoop',
      messageId,
      error: (error as Error).message,
      stack: (error as Error).stack,
    });

    // Re-throw error for socket layer to handle and emit error event to client
    throw error;
  }
};
