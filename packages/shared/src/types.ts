/**
 * Socket.io Event Types
 * Ensures type safety between client and server
 */

// Client → Server: User sends message
export interface UserMessageEvent {
  event: 'user_message';
  payload: {
    content: string;
    messageId: string;
  };
}

// Server → Client: Agent response (complete, no streaming yet)
export interface AgentResponseEvent {
  event: 'agent_response';
  payload: {
    content: string;
    messageId: string;
  };
}

// Server → Client: Error occurred
export interface ErrorEvent {
  event: 'error';
  payload: {
    message: string;
    code?: string;
  };
}

// Union type for all Socket events
export type SocketEvent = UserMessageEvent | AgentResponseEvent | ErrorEvent;

/**
 * Chat Message Model
 * Used by client to store message history
 */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  status: 'sending' | 'complete' | 'error';
}
