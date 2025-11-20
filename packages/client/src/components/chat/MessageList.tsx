/**
 * MessageList Component
 * Scrollable message display (auto-scroll handled by parent)
 */

import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageItem } from './MessageItem';
import type { ChatMessage } from '@bmad-app/shared';

interface MessageListProps {
  messages: ChatMessage[];
  isStreaming?: boolean;
}

/**
 * Scrollable message list
 * Displays all messages in conversation with empty state
 * Note: Auto-scroll is handled by parent component to avoid ScrollArea state conflicts
 */
export const MessageList: React.FC<MessageListProps> = ({ messages, isStreaming = false }) => {
  return (
    <ScrollArea className="flex-1" style={{ padding: '32px 48px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div className="flex flex-col" style={{ gap: '20px' }}>
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground mt-12">
              <p className="text-lg font-medium">Welcome to BMAD + Claude SDK</p>
              <p className="text-sm mt-2">Start a conversation by typing a message below...</p>
            </div>
          )}
          {messages.map((msg) => (
            <MessageItem
              key={msg.id}
              message={msg}
              isStreaming={isStreaming && msg.role === 'assistant' && msg.status === 'sending'}
            />
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};
