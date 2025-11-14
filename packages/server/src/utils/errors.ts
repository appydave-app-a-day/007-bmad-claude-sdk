/**
 * Custom error class for tool-related failures
 *
 * Purpose:
 * - Distinguish tool failures from generic errors
 * - Provide user-friendly error messages
 * - Include error codes for categorization
 * - Enable conversational error recovery
 *
 * Common error codes:
 * - FILE_NOT_FOUND: File does not exist
 * - PATH_TRAVERSAL: Path outside allowed directories
 * - INVALID_JSON: JSON parsing failed
 * - TOOL_ERROR: Generic tool error (default)
 */
export class ToolError extends Error {
  code: string;

  constructor(message: string, code: string = 'TOOL_ERROR') {
    super(message);
    this.name = 'ToolError';
    this.code = code;
  }
}
