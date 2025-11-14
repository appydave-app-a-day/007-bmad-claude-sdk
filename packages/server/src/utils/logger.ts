/**
 * Structured logging utility with color-coded output
 * Format: [timestamp] [component] message [data]
 *
 * Levels:
 * - info (blue): General information
 * - warn (yellow): Warnings
 * - error (red): Errors
 * - debug (gray): Debug info (requires DEBUG=true)
 */

// ANSI color codes
const colors = {
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  gray: '\x1b[90m',
  reset: '\x1b[0m',
};

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

/**
 * Format log message with timestamp, component, and optional data
 */
function formatMessage(
  level: LogLevel,
  component: string,
  message: string,
  data?: Record<string, any>
): string {
  const timestamp = new Date().toISOString();
  const color = colors[level === 'info' ? 'blue' : level === 'warn' ? 'yellow' : level === 'error' ? 'red' : 'gray'];
  const dataStr = data ? ` ${JSON.stringify(data)}` : '';

  return `${color}[${timestamp}] [${component}] ${message}${dataStr}${colors.reset}`;
}

/**
 * Log info message
 */
export function info(message: string, data?: Record<string, any>): void {
  console.log(formatMessage('info', 'Server', message, data));
}

/**
 * Log warning message
 */
export function warn(message: string, data?: Record<string, any>): void {
  console.warn(formatMessage('warn', 'Server', message, data));
}

/**
 * Log error message
 */
export function error(message: string, data?: Record<string, any>): void {
  console.error(formatMessage('error', 'Server', message, data));
}

/**
 * Log debug message (only if DEBUG=true)
 */
export function debug(message: string, data?: Record<string, any>): void {
  if (process.env.DEBUG === 'true') {
    console.log(formatMessage('debug', 'Server', message, data));
  }
}

/**
 * Logger object with all log methods
 */
export const logger = {
  info,
  warn,
  error,
  debug,
};
