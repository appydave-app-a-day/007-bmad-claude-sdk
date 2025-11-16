/**
 * write_file Tool: Write or update files in /public directory
 *
 * Purpose:
 * - Enable agent to persist HTML/CSS/JS files through conversation
 * - Fourth of four domain-agnostic custom tools for /public directory
 * - Complements read_file tool for complete read-modify-write workflow
 *
 * Security:
 * - Path sandboxing via validatePath() prevents directory traversal
 * - Only files within /public directory writable
 * - User-friendly error messages for agent to communicate issues
 *
 * Usage (by agent):
 * Agent: "I'll create an index.html file"
 * Tool call: write_file({ filepath: "index.html", content: "<!DOCTYPE html>..." })
 * Returns: MCP CallToolResult with success message
 *
 * Update Workflow:
 * To update existing files, agent must:
 * 1. Read current content using read_file(filepath)
 * 2. Modify content in memory
 * 3. Write complete updated content using write_file(filepath, updatedContent)
 * Note: write_file performs OVERWRITE, not in-place modification
 */

import fs from 'fs/promises';
import path from 'path';
import { tool } from '@anthropic-ai/claude-agent-sdk';
import { z } from 'zod';
import { validatePath } from '../utils/path-validator.js';
import { ToolError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

// Public directory - all HTML/CSS/JS files served here
const PUBLIC_DIR = path.join(process.cwd(), 'public');

/**
 * Write File Tool Definition for Agent SDK
 * Uses Agent SDK's tool() function to create MCP-compatible tool
 */
export const writeFileTool = tool(
  'write_file',
  'Write or update a file in the /public directory. Creates directories if needed. Use for HTML, CSS, JavaScript, or any text-based files.',
  {
    filepath: z.string().describe('Relative path to the file within /public directory (e.g., "index.html" or "pages/products.html")'),
    content: z.string().describe('Text content to write to the file (HTML, CSS, JavaScript, or any text format)'),
  },
  async (args) => {
    const { filepath, content } = args;

    try {
      // Validate path to prevent directory traversal
      const fullPath = validatePath(filepath, PUBLIC_DIR);

      logger.debug(`Writing file: ${fullPath}`, { component: 'Tool:write_file' });

      // Create directory structure if needed (mkdir -p behavior)
      await fs.mkdir(path.dirname(fullPath), { recursive: true });

      // Write file
      await fs.writeFile(fullPath, content, 'utf-8');

      // Log success with file metadata
      logger.info(`Successfully wrote ${filepath}`, {
        component: 'Tool:write_file',
        size: content.length,
      });

      // Return MCP CallToolResult format
      return {
        content: [
          {
            type: 'text' as const,
            text: `File ${filepath} written successfully (${content.length} bytes)`,
          },
        ],
      };
    } catch (error) {
      // Handle permission denied
      if ((error as NodeJS.ErrnoException).code === 'EACCES') {
        const errorMsg = `Permission denied: ${filepath}`;
        logger.error(errorMsg, { component: 'Tool:write_file' });
        return {
          content: [
            {
              type: 'text' as const,
              text: errorMsg,
            },
          ],
          isError: true,
        };
      }

      // Handle path traversal and other ToolErrors
      if (error instanceof ToolError) {
        logger.error(error.message, { component: 'Tool:write_file', code: error.code });
        return {
          content: [
            {
              type: 'text' as const,
              text: error.message,
            },
          ],
          isError: true,
        };
      }

      // Log unexpected errors
      const errorMsg = `Unexpected error writing ${filepath}: ${(error as Error).message}`;
      logger.error(errorMsg, { component: 'Tool:write_file' });
      return {
        content: [
          {
            type: 'text' as const,
            text: errorMsg,
          },
        ],
        isError: true,
      };
    }
  }
);
