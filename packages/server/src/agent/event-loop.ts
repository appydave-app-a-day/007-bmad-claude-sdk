/**
 * Agent Event Loop
 *
 * This is the core event loop that handles user messages and streams agent responses.
 *
 * Story 2.2: Basic synchronous event loop (no streaming)
 * Story 2.3: Added streaming support with Socket.io
 * Stories 2.4-2.6: Will register tools
 */

import { createQuery, getAgentOptions } from './agent-config.js';
import { logger } from '../utils/logger.js';
import { Socket } from 'socket.io';

/**
 * Handle user message with streaming response
 *
 * Story 2.3: Modified to emit chunks in real-time via Socket.io
 *
 * Changes from Story 2.2:
 * - Accept socket parameter for chunk emission
 * - Iterate async generator instead of collecting all chunks
 * - Emit agent_response_chunk for each chunk
 * - Emit agent_response_complete when done
 *
 * @param message - The user's message content
 * @param messageId - Unique identifier for tracking this message
 * @param socket - Socket.io socket instance for emitting chunks
 * @returns Promise<void> - No return value; responses emitted via socket
 */
export const handleUserMessage = async (
  message: string,
  messageId: string,
  socket: Socket
): Promise<void> => {
  try {
    // Log receipt of user message
    logger.info('Received user message', {
      component: 'AgentEventLoop',
      messageId,
      messagePreview: message.substring(0, 100),
    });

    // Create streaming query (Story 2.3: streaming enabled by default)
    logger.info('Calling Agent SDK', { component: 'AgentEventLoop', messageId });
    const queryIterator = createQuery(message);

    logger.info('Streaming started', { component: 'AgentEventLoop', messageId });

    let chunkIndex = 0;

    // Iterate over streaming chunks (async generator)
    // Story 2.3: Emit each chunk immediately instead of collecting
    for await (const chunk of queryIterator) {
      // Extract text from chunk structure (learned from Story 2.2 bug fix)
      // SDK returns: { type: "assistant", message: { content: [{ text: "..." }] } }
      let textContent = '';

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
              textContent += block.text;
            }
          }
        } else if (typeof content === 'string') {
          textContent = content;
        }
      }

      // Emit chunk to client via Socket.io (Story 2.3)
      if (textContent) {
        socket.emit('agent_response_chunk', {
          content: textContent,
          messageId,
          chunkIndex,
        });

        logger.info(`Chunk ${chunkIndex} received`, {
          component: 'AgentEventLoop',
          messageId,
          chunkLength: textContent.length,
        });

        chunkIndex++;
      }
    }

    // Emit completion signal (Story 2.3)
    socket.emit('agent_response_complete', { messageId });

    logger.info('Streaming complete', {
      component: 'AgentEventLoop',
      messageId,
      totalChunks: chunkIndex,
    });
  } catch (error) {
    // Log streaming error with stack trace for debugging
    logger.error('Streaming failed', {
      component: 'AgentEventLoop',
      messageId,
      error: (error as Error).message,
      stack: (error as Error).stack,
    });

    // Emit error to client (Story 2.3: streaming error handling)
    socket.emit('error', {
      message: 'Streaming failed. Please try again.',
      code: 'STREAMING_ERROR',
    });
  }
};
