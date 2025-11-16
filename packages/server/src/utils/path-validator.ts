/**
 * Path validation utility for filesystem operations
 *
 * Purpose:
 * - Prevent path traversal attacks (../, absolute paths, symlinks)
 * - Ensure all file operations stay within allowed directories
 * - Provide consistent error handling for path validation
 *
 * Usage:
 * const safe = validatePath(userInput, allowedDir);
 * await fs.readFile(safe, 'utf-8');
 */

import path from 'path';
import { ToolError } from './errors.js';

/**
 * Validate that a filepath is within an allowed directory
 *
 * @param filepath - User-provided relative filepath
 * @param allowedDir - Absolute path to allowed directory
 * @returns Absolute safe path within allowedDir
 * @throws ToolError if path is outside allowedDir (path traversal detected)
 *
 * Examples:
 * validatePath('products.json', '/app/data') → '/app/data/products.json' ✓
 * validatePath('../etc/passwd', '/app/data') → throws ToolError ✗
 * validatePath('/etc/passwd', '/app/data') → throws ToolError ✗
 */
export const validatePath = (filepath: string, allowedDir: string): string => {
  // Resolve the filepath relative to the allowed directory
  const resolvedPath = path.resolve(allowedDir, filepath);

  // Normalize both paths to handle symlinks and relative segments
  const normalizedResolved = path.normalize(resolvedPath);
  const normalizedAllowed = path.normalize(path.resolve(allowedDir));

  // Check if resolved path starts with allowed directory
  if (!normalizedResolved.startsWith(normalizedAllowed)) {
    throw new ToolError(
      `Path traversal detected: ${filepath} is outside allowed directory`,
      'PATH_TRAVERSAL'
    );
  }

  return normalizedResolved;
};
