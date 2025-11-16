/**
 * Socket.io Client Setup
 * Creates and configures Socket.io client instance with auto-reconnection
 */

import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

/**
 * Create Socket.io client instance with auto-reconnection configuration
 * @returns Configured Socket.io client instance
 */
export const createSocket = (): Socket => {
  const socket = io(SOCKET_URL, {
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5
  });

  // Connection event handlers for development visibility
  socket.on('connect', () => {
    console.log('✅ Connected to server');
  });

  socket.on('disconnect', () => {
    console.log('❌ Disconnected from server');
  });

  socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
  });

  return socket;
};
