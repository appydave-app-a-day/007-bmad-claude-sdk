/**
 * ChatInterface Component
 * Main chat container integrating all chat subcomponents
 */

import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { TypingIndicator } from './TypingIndicator';
import { PagesMenu } from './PagesMenu';
import { useSocket } from '../../hooks/useSocket';
import { useChat } from '../../hooks/useChat';

/**
 * Main chat interface component
 * Manages Socket.io connection, chat state, and message flow
 */
export const ChatInterface: React.FC = () => {
  const { messages, addMessage, updateLastMessage } = useChat();

  const { sendMessage, isConnected, isStreaming } = useSocket({
    onChunk: (chunk: string, messageId: string) => {
      updateLastMessage(messageId, chunk);
    },
    onComplete: (messageId: string) => {
      console.log('✅ Agent response complete:', messageId);
      // Mark message as complete by updating the last message
      // The status is already being managed in the streaming state
    },
    onError: (error: { message: string; code?: string }) => {
      console.error('❌ Socket error:', error);
      // TODO: Display error message in UI (post-MVP)
    }
  });

  /**
   * Handle user sending a message
   * Creates user message object and emits to server via Socket.io
   */
  const handleSendMessage = (content: string) => {
    const messageId = crypto.randomUUID();

    // Add user message to state (optimistic update)
    addMessage({
      id: messageId,
      role: 'user',
      content,
      timestamp: Date.now(),
      status: 'complete'
    });

    // Send message to server
    sendMessage(content, messageId);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div style={{ borderBottom: '1px solid hsl(var(--border))' }}>
        <header style={{ padding: '16px 48px' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }} className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">BMAD + Claude SDK</h1>
              <p className="text-sm text-muted-foreground">
                Self-editing web application demo
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Pages Menu */}
              <PagesMenu />

              {/* Connection Status */}
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm text-muted-foreground">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>

              {/* ThemeToggle placeholder - Story 3.4 */}
            </div>
          </div>
        </header>
      </div>

      {/* Message List */}
      <MessageList messages={messages} isStreaming={isStreaming} />

      {/* Typing Indicator */}
      {isStreaming && <TypingIndicator />}

      {/* Message Input */}
      <MessageInput
        onSend={handleSendMessage}
        disabled={!isConnected || isStreaming}
      />
    </div>
  );
};
