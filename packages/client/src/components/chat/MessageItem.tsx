/**
 * MessageItem Component
 * Displays individual message bubble with role-based styling
 */

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
      <div
        className={`max-w-[85%] rounded-2xl shadow-sm ${
          isUser
            ? 'rounded-br-sm'
            : 'rounded-bl-sm'
        }`}
        style={{
          padding: '14px 18px',
          backgroundColor: isUser ? '#2563eb' : '#f1f5f9',
          color: isUser ? '#ffffff' : '#1e293b'
        }}
      >
        <div className="whitespace-pre-wrap break-words text-base leading-relaxed">
          {message.content}
        </div>
        <div
          className="text-xs mt-2 font-medium"
          style={{
            color: isUser ? 'rgba(255, 255, 255, 0.8)' : 'rgba(15, 23, 42, 0.6)'
          }}
        >
          {formatTime(message.timestamp)}
          {isStreaming && message.role === 'assistant' && ' • Typing...'}
        </div>
      </div>
    </div>
  );
};
