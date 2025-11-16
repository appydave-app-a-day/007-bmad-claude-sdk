/**
 * TypingIndicator Component
 * Animated dots indicating agent is processing/streaming
 */

/**
 * Loading indicator shown while agent is streaming response
 * Uses CSS animation for pulsing dots effect
 */
export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center gap-2 px-4 pb-2" aria-live="polite">
      <span className="text-sm text-muted-foreground">Claude is typing</span>
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
};
