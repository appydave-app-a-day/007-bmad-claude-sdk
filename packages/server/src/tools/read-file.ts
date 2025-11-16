/**
 * read_file Tool: Read complete file content from /public directory
 *
 * Purpose:
 * - Enable agent to read HTML/CSS/JS files created in previous conversations
 * - Provide full file content for modification workflows
 * - Third of four domain-agnostic custom tools for /public directory
 *
 * Security:
 * - Path sandboxing via validatePath() prevents directory traversal
 * - Only files within /public directory accessible
 * - User-friendly error messages for agent to communicate issues
 *
 * Usage (by agent):
 * Agent: "I'll read the index.html file"
 * Tool call: read_file({ filepath: "index.html" })
 * Returns: MCP CallToolResult with full file content as string
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
 * Read File Tool Definition for Agent SDK
 * Uses Agent SDK's tool() function to create MCP-compatible tool
 */
export const readFileTool = tool(
  'read_file',
  'Read complete contents of a file in /public directory. Returns full file content as string. Use for HTML/CSS/JS files.',
  {
    filepath: z.string().describe('Relative path to file within /public directory (e.g., "index.html" or "pages/about.html")'),
  },
  async (args) => {
    const { filepath } = args;

    try {
      // Validate path to prevent directory traversal
      const fullPath = validatePath(filepath, PUBLIC_DIR);

      logger.debug(`Reading file: ${fullPath}`, { component: 'Tool:read_file' });

      // Read file content
      const content = await fs.readFile(fullPath, 'utf-8');

      // Log success with file metadata
      logger.info(`Successfully read ${filepath}`, {
        component: 'Tool:read_file',
        size: content.length,
      });

      // Return MCP CallToolResult format
      return {
        content: [
          {
            type: 'text' as const,
            text: content,
          },
        ],
      };
    } catch (error) {
      // Handle file not found
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        const errorMsg = `File not found: ${filepath}`;
        logger.error(errorMsg, { component: 'Tool:read_file' });
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
        logger.error(error.message, { component: 'Tool:read_file', code: error.code });
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
      const errorMsg = `Unexpected error reading ${filepath}: ${(error as Error).message}`;
      logger.error(errorMsg, { component: 'Tool:read_file' });
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
