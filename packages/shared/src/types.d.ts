/**
 * Socket.io Event Types
 * Ensures type safety between client and server
 */
export interface UserMessageEvent {
    event: 'user_message';
    payload: {
        content: string;
        messageId: string;
    };
}
export interface AgentResponseEvent {
    event: 'agent_response';
    payload: {
        content: string;
        messageId: string;
    };
}
export interface AgentResponseChunkEvent {
    event: 'agent_response_chunk';
    payload: {
        content: string;
        messageId: string;
        chunkIndex?: number;
    };
}
export interface AgentResponseCompleteEvent {
    event: 'agent_response_complete';
    payload: {
        messageId: string;
    };
}
export interface ErrorEvent {
    event: 'error';
    payload: {
        message: string;
        code?: string;
    };
}
export type SocketEvent = UserMessageEvent | AgentResponseEvent | AgentResponseChunkEvent | AgentResponseCompleteEvent | ErrorEvent;
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
/**
 * Tool Result Interface
 * Standard return type for all custom tools
 */
export interface ToolResult<T = any> {
    success: boolean;
    data?: T;
    error?: string;
}
/**
 * Read JSON Tool Parameters
 * Parameters for read_json tool
 */
export interface ReadJsonParams {
    filepath: string;
}
/**
 * Write JSON Tool Parameters
 * Parameters for write_json tool
 */
export interface WriteJsonParams {
    filepath: string;
    content: any;
}
/**
 * List Files Tool Parameters
 * Parameters for list_files tool
 */
export interface ListFilesParams {
    pattern?: string;
}
/**
 * Preview File Tool Parameters
 * Parameters for preview_file tool
 */
export interface PreviewFileParams {
    filepath: string;
    maxLines?: number;
}
/**
 * Read File Tool Parameters
 * Parameters for read_file tool
 */
export interface ReadFileParams {
    filepath: string;
}
/**
 * Write File Tool Parameters
 * Parameters for write_file tool
 */
export interface WriteFileParams {
    filepath: string;
    content: string;
}
/**
 * Single message in conversation history
 * Used to maintain multi-turn conversation context
 * Story 2.7: Enables agent to remember previous messages in a conversation
 */
export interface ConversationMessage {
    /** Role of the message sender */
    role: 'user' | 'assistant';
    /** Message content */
    content: string;
    /** Optional timestamp (milliseconds since epoch) */
    timestamp?: number;
}
/**
 * Array of conversation messages
 * Maintained per Socket.io connection for session-based memory
 * Story 2.7: Each socket connection has independent conversation history
 */
export type ConversationHistory = ConversationMessage[];
//# sourceMappingURL=types.d.ts.map