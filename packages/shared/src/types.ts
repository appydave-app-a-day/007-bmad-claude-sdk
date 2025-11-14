// ChatMessage interface - used for chat message state
export interface ChatMessage {
  id: string;          // Unique message identifier
  role: 'user' | 'agent';  // Message sender
  content: string;     // Message text
  timestamp: number;   // Unix timestamp
}

// SocketEvent type - event names for Socket.io
export type SocketEvent =
  | 'user_message'
  | 'agent_response_chunk'
  | 'agent_response_complete'
  | 'error';
