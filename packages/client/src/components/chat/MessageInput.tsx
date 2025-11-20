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
    <div className="border-t bg-muted/30 backdrop-blur-sm" style={{ padding: '20px 48px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            disabled={disabled}
            className="flex-1 resize-none rounded-lg border-2 border-input bg-background text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all"
            style={{ padding: '12px 16px', minHeight: '50px', maxHeight: '200px' }}
            rows={2}
          />
          <Button
            onClick={handleSend}
            disabled={disabled || !input.trim()}
            className="self-end rounded-lg font-medium transition-all"
            style={{
              minWidth: '90px',
              height: '50px',
              backgroundColor: (disabled || !input.trim()) ? '#94a3b8' : '#2563eb',
              color: '#ffffff'
            }}
          >
            Send
          </Button>
        </div>
        <div className="text-center" style={{ marginTop: '10px' }}>
          <p className="text-xs text-muted-foreground">
            Press <kbd style={{ padding: '3px 8px', fontSize: '11px', fontWeight: 600, backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', margin: '0 4px' }}>Enter</kbd> to send • <kbd style={{ padding: '3px 8px', fontSize: '11px', fontWeight: 600, backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', margin: '0 4px' }}>Shift + Enter</kbd> for new line
          </p>
        </div>
      </div>
    </div>
  );
};
