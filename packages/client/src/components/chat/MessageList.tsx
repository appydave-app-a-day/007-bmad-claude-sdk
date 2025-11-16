/**
 * MessageList Component
 * Scrollable message display with auto-scroll to latest message
 */

import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageItem } from './MessageItem';
import type { ChatMessage } from '@bmad-app/shared';

interface MessageListProps {
  messages: ChatMessage[];
  isStreaming?: boolean;
}

/**
 * Scrollable message list with auto-scroll behavior
 * Displays all messages in conversation with empty state
 */
export const MessageList: React.FC<MessageListProps> = ({ messages, isStreaming = false }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, isStreaming]);

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="flex flex-col gap-4">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground mt-8">
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
        {/* Invisible element for auto-scroll target */}
        <div ref={scrollRef} />
      </div>
    </ScrollArea>
  );
};
