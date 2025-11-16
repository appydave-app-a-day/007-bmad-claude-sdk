/**
 * MessageInput Component
 * Text input with send button and keyboard shortcuts
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface MessageInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

/**
 * Message input field with send button
 * Supports Enter to send, Shift+Enter for newline
 */
export const MessageInput: React.FC<MessageInputProps> = ({ onSend, disabled = false }) => {
  const [input, setInput] = useState('');

  /**
   * Handle sending message
   * Trims whitespace and prevents empty messages
   */
  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    onSend(trimmed);
    setInput('');
  };

  /**
   * Handle keyboard shortcuts
   * Enter: send message (unless Shift is held)
   * Shift+Enter: add newline
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    // Shift+Enter: Allow default behavior (newline)
  };

  return (
    <div className="border-t p-4">
      <div className="flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          disabled={disabled}
          className="flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[60px] max-h-[200px]"
          rows={2}
        />
        <Button
          onClick={handleSend}
          disabled={disabled || !input.trim()}
          className="self-end"
        >
          Send
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  );
};
