/**
 * MessageItem Component
 * Displays individual message bubble with role-based styling
 */

import { Card, CardContent } from '@/components/ui/card';
import type { ChatMessage } from '@bmad-app/shared';

interface MessageItemProps {
  message: ChatMessage;
  isStreaming?: boolean;
}

/**
 * Individual message bubble component
 * Applies different styling based on message role (user vs assistant)
 */
export const MessageItem: React.FC<MessageItemProps> = ({ message, isStreaming = false }) => {
  const isUser = message.role === 'user';

  // Format timestamp as HH:MM
  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <Card
        className={`max-w-[80%] ${
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted'
        }`}
      >
        <CardContent className="p-3">
          <div className="whitespace-pre-wrap break-words">
            {message.content}
          </div>
          <div className={`text-xs mt-2 ${isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
            {formatTime(message.timestamp)}
            {isStreaming && message.role === 'assistant' && ' • Typing...'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
