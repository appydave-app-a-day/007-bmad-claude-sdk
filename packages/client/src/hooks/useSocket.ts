/**
 * useSocket Hook
 * Manages Socket.io client lifecycle and event handling
 */

import { useEffect, useState, useCallback } from 'react';
import { createSocket } from '../lib/socket';
import type { Socket } from 'socket.io-client';

interface UseSocketOptions {
  onChunk: (chunk: string, messageId: string) => void;
  onComplete: (messageId: string) => void;
  onError: (error: { message: string; code?: string }) => void;
}

interface UseSocketReturn {
  sendMessage: (content: string, messageId: string) => void;
  isConnected: boolean;
  isStreaming: boolean;
}

/**
 * Custom hook for Socket.io client management
 * Handles connection lifecycle, event listeners, and message sending
 * @param options - Callback functions for socket events
 * @returns Socket operations and connection state
 */
export const useSocket = (options: UseSocketOptions): UseSocketReturn => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    // Initialize socket connection
    const socketInstance = createSocket();
    setSocket(socketInstance);

    // Connection state handlers
    socketInstance.on('connect', () => {
      setIsConnected(true);
      console.log('✅ Socket connected');
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
      setIsStreaming(false);
      console.log('❌ Socket disconnected');
    });

    // Agent response chunk handler (streaming)
    socketInstance.on('agent_response_chunk', (data: { content: string; messageId: string }) => {
      setIsStreaming(true);
      options.onChunk(data.content, data.messageId);
    });

    // Agent response complete handler (end of streaming)
    socketInstance.on('agent_response_complete', (data: { messageId: string }) => {
      setIsStreaming(false);
      options.onComplete(data.messageId);
    });

    // Error handler
    socketInstance.on('error', (data: { message: string; code?: string }) => {
      setIsStreaming(false);
      console.error('❌ Socket error:', {
        message: data.message,
        code: data.code,
        fullError: data,
      });
      options.onError(data);
    });

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
      console.log('🔌 Socket disconnected (component unmount)');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - socket should only initialize once

  /**
   * Send user message to server
   * @param content - Message content
   * @param messageId - Unique message identifier
   */
  const sendMessage = useCallback((content: string, messageId: string) => {
    if (!socket) {
      console.warn('⚠️ Socket not initialized, cannot send message');
      return;
    }
    if (!isConnected) {
      console.warn('⚠️ Socket not connected, cannot send message');
      return;
    }
    socket.emit('user_message', { content, messageId });
    console.log('📤 Sent user_message:', { messageId, contentLength: content.length });
  }, [socket, isConnected]);

  return { sendMessage, isConnected, isStreaming };
};
