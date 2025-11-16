/**
 * Agent Event Loop
 *
 * This is the core event loop that handles user messages and streams agent responses.
 *
 * Story 2.2: Basic synchronous event loop (no streaming)
 * Story 2.3: Added streaming support with Socket.io
 * Stories 2.4-2.6: Custom tools integration
 * Story 2.7: Conversation memory with async generator pattern
 */

import { getAgentOptions } from './agent-config.js';
import { query } from '@anthropic-ai/claude-agent-sdk';
import { logger } from '../utils/logger.js';
import { Socket } from 'socket.io';
import { ConversationHistory, ConversationMessage } from '@bmad-app/shared';
import type { SDKUserMessage } from '@anthropic-ai/claude-agent-sdk';

/**
 * Handle user message with streaming response and conversation history
 *
 * Story 2.3: Modified to emit chunks in real-time via Socket.io
 * Story 2.7: Added conversation history support with async generator pattern
 *
 * Changes from Story 2.3:
 * - Accept history parameter with previous conversation
 * - Log conversation history size before agent call
 * - Pass history to Agent SDK via async iterable
 * - Accumulate complete response during streaming
 * - Return assistant message for caller to append to history
 *
 * @param message - The user's message content
 * @param messageId - Unique identifier for tracking this message
 * @param socket - Socket.io socket instance for emitting chunks
 * @param history - Conversation history (array of previous messages)
 * @returns Promise<ConversationMessage | null> - Assistant message or null on error
 */
export const handleUserMessage = async (
  message: string,
  messageId: string,
  socket: Socket,
  history: ConversationHistory
): Promise<ConversationMessage | null> => {
  try {
    // Log receipt of user message
    logger.info('Received user message', {
      component: 'AgentEventLoop',
      messageId,
      messagePreview: message.substring(0, 100),
    });

    // Story 2.7: Log conversation history size (AC 6)
    logger.info(`Conversation history: ${history.length} messages`, {
      component: 'AgentEventLoop',
      messageId,
      messageCount: history.length,
    });

    // Story 2.7: Create async generator that yields conversation history + new message
    // SDK receives conversation as async iterable - maintains full multi-turn context
    async function* createConversationIterable(): AsyncGenerator<SDKUserMessage> {
      // Yield each previous user message from history
      for (const msg of history) {
        if (msg.role === 'user') {
          yield {
            type: 'user' as const,
            message: { role: 'user' as const, content: msg.content },
            parent_tool_use_id: null,
            session_id: socket.id,
          };
        }
        // Note: Assistant messages are implicitly maintained by SDK
        // when we yield user messages - SDK maintains full conversation context
      }

      // Yield the new user message
      yield {
        type: 'user' as const,
        message: { role: 'user' as const, content: message },
        parent_tool_use_id: null,
        session_id: socket.id,
      };
    }

    // Call Agent SDK with conversation iterable (not simple string)
    logger.info('Calling Agent SDK with conversation history', {
      component: 'AgentEventLoop',
      messageId,
    });
    const conversationIterable = createConversationIterable();
    const queryIterator = query({
      prompt: conversationIterable,
      options: getAgentOptions(),
    });

    logger.info('Streaming started', { component: 'AgentEventLoop', messageId });

    let chunkIndex = 0;
    let completeResponse = ''; // Story 2.7: Accumulate complete response for history

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
        // Story 2.7: Accumulate for conversation history
        completeResponse += textContent;

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

    // Story 2.7: Return assistant message for caller to append to history
    return {
      role: 'assistant',
      content: completeResponse,
      timestamp: Date.now(),
    };
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

    // Story 2.7: Return null on error (no message to append to history)
    return null;
  }
};
