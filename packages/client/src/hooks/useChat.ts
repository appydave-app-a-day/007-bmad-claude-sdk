/**
 * useChat Hook
 * Manages chat message state with streaming support
 */

import { useState } from 'react';
import type { ChatMessage } from '@bmad-app/shared';

interface ChatState {
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  updateLastMessage: (messageId: string, chunk: string) => void;
  clearHistory: () => void;
}

/**
 * Custom hook for chat message state management
 * Handles message history, streaming updates, and clearing
 * @returns Chat state and manipulation functions
 */
export const useChat = (): ChatState => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  /**
   * Add a new message to chat history
   * Used for user messages (optimistic updates)
   * @param message - Complete message object to add
   */
  const addMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  };

  /**
   * Update last message with streaming chunk
   * Creates new assistant message if needed, or appends to existing
   * @param messageId - Message identifier for tracking
   * @param chunk - Content chunk to append
   */
  const updateLastMessage = (messageId: string, chunk: string) => {
    setMessages(prev => {
      const lastMsg = prev[prev.length - 1];

      // Check if last message is assistant message
      if (!lastMsg || lastMsg.role !== 'assistant') {
        // Create new assistant message with chunk as initial content
        return [...prev, {
          id: messageId,
          role: 'assistant',
          content: chunk,
          timestamp: Date.now(),
          status: 'sending'
        }];
      }

      // Append chunk to existing assistant message
      return [...prev.slice(0, -1), {
        ...lastMsg,
        content: lastMsg.content + chunk,
        status: 'sending'
      }];
    });
  };

  /**
   * Clear all messages from chat history
   * Message history not persisted (cleared on page refresh)
   */
  const clearHistory = () => {
    setMessages([]);
  };

  return { messages, addMessage, updateLastMessage, clearHistory };
};
