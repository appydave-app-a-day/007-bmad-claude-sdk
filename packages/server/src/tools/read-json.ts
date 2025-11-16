/**
 * read_json Tool: Read and parse JSON files from /data directory
 *
 * Purpose:
 * - Enable agent to read JSON data files created in previous conversations
 * - Provide structured data access for data-driven conversational development
 * - First of three domain-agnostic custom tools
 *
 * Security:
 * - Path sandboxing via validatePath() prevents directory traversal
 * - Only files within /data directory accessible
 * - User-friendly error messages for agent to communicate issues
 *
 * Usage (by agent):
 * Agent: "I'll read the products.json file"
 * Tool call: read_json({ filepath: "products.json" })
 * Returns: MCP CallToolResult with content array
 */

import fs from 'fs/promises';
import path from 'path';
import { tool } from '@anthropic-ai/claude-agent-sdk';
import { z } from 'zod';
import { validatePath } from '../utils/path-validator.js';
import { ToolError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

// Data directory - all JSON files stored here
const DATA_DIR = path.join(process.cwd(), 'data');

/**
 * Read JSON Tool Definition for Agent SDK
 * Uses Agent SDK's tool() function to create MCP-compatible tool
 */
export const readJsonTool = tool(
  'read_json',
  'Read and parse a JSON file from the /data directory. Returns the parsed JSON content.',
  {
    filepath: z.string().describe('Relative path to the JSON file within /data directory (e.g., "products.json")'),
  },
  async (args) => {
    const { filepath } = args;

    try {
      // Validate path to prevent directory traversal
      const fullPath = validatePath(filepath, DATA_DIR);

      logger.debug(`Reading JSON file: ${fullPath}`, { component: 'Tool:read_json' });

      // Read file content
      const content = await fs.readFile(fullPath, 'utf-8');

      // Parse JSON
      const data = JSON.parse(content);

      // Log success with file metadata
      const keys = typeof data === 'object' && data !== null ? Object.keys(data).length : 0;
      logger.info(`Successfully read ${filepath}`, {
        component: 'Tool:read_json',
        size: content.length,
        keys: keys,
      });

      // Return MCP CallToolResult format
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    } catch (error) {
      // Handle file not found
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        const errorMsg = `File not found: ${filepath}`;
        logger.error(errorMsg, { component: 'Tool:read_json' });
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

      // Handle invalid JSON syntax
      if (error instanceof SyntaxError) {
        const errorMsg = `Invalid JSON in ${filepath}: ${error.message}`;
        logger.error(errorMsg, { component: 'Tool:read_json' });
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
        logger.error(error.message, { component: 'Tool:read_json', code: error.code });
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
      logger.error(errorMsg, { component: 'Tool:read_json' });
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
