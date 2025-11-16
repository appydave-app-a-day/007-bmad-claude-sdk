/**
 * write_json Tool: Write or update JSON files in /data directory
 *
 * Purpose:
 * - Enable agent to persist data files through conversation
 * - Second of three domain-agnostic custom tools
 * - Complements read_json tool from Story 2.4
 *
 * Security:
 * - Path sandboxing via validatePath() prevents directory traversal
 * - Only files within /data directory writable
 * - User-friendly error messages for agent to communicate issues
 *
 * Usage (by agent):
 * Agent: "I'll create a products.json file with 3 items"
 * Tool call: write_json({ filepath: "products.json", content: [...] })
 * Returns: MCP CallToolResult with success message
 *
 * Update Workflow:
 * To update existing files, agent must:
 * 1. Read current content using read_json(filepath)
 * 2. Modify data in memory
 * 3. Write complete updated content using write_json(filepath, updatedData)
 * Note: write_json performs OVERWRITE, not in-place modification
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
 * Write JSON Tool Definition for Agent SDK
 * Uses Agent SDK's tool() function to create MCP-compatible tool
 */
export const writeJsonTool = tool(
  'write_json',
  'Write or update a JSON file in the /data directory. Creates directories if needed. Content must be a valid JavaScript object or array.',
  {
    filepath: z.string().describe('Relative path to the JSON file within /data directory (e.g., "products.json" or "catalog/items.json")'),
    content: z.any().describe('JavaScript object or array to write as JSON. Will be stringified with 2-space indentation.'),
  },
  async (args) => {
    const { filepath, content } = args;

    try {
      // Validate path to prevent directory traversal
      const fullPath = validatePath(filepath, DATA_DIR);

      logger.debug(`Writing JSON file: ${fullPath}`, { component: 'Tool:write_json' });

      // Create directory structure if needed (mkdir -p behavior)
      await fs.mkdir(path.dirname(fullPath), { recursive: true });

      // Handle case where agent passes already-stringified JSON (from read_json tool)
      // If content is a string, try to parse it first to avoid double-stringification
      let parsedContent = content;
      if (typeof content === 'string') {
        try {
          parsedContent = JSON.parse(content);
          logger.debug('Parsed stringified JSON content', { component: 'Tool:write_json' });
        } catch {
          // If parsing fails, content is a literal string value - keep as is
          logger.debug('Content is a string literal, not JSON', { component: 'Tool:write_json' });
        }
      }

      // Stringify content with human-readable formatting
      const jsonString = JSON.stringify(parsedContent, null, 2);

      // Write file
      await fs.writeFile(fullPath, jsonString, 'utf-8');

      // Log success with file metadata
      const keys = Array.isArray(parsedContent)
        ? parsedContent.length
        : (typeof parsedContent === 'object' && parsedContent !== null ? Object.keys(parsedContent).length : 0);

      logger.info(`Successfully wrote ${filepath}`, {
        component: 'Tool:write_json',
        size: jsonString.length,
        keys: keys,
      });

      // Return MCP CallToolResult format
      return {
        content: [
          {
            type: 'text' as const,
            text: `File ${filepath} written successfully (${jsonString.length} bytes, ${keys} ${Array.isArray(parsedContent) ? 'items' : 'keys'})`,
          },
        ],
      };
    } catch (error) {
      // Handle permission denied
      if ((error as NodeJS.ErrnoException).code === 'EACCES') {
        const errorMsg = `Permission denied: ${filepath}`;
        logger.error(errorMsg, { component: 'Tool:write_json' });
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

      // Handle invalid content (circular references, etc.)
      if (error instanceof TypeError) {
        const errorMsg = `Invalid content for JSON: ${error.message}`;
        logger.error(errorMsg, { component: 'Tool:write_json' });
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
        logger.error(error.message, { component: 'Tool:write_json', code: error.code });
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
      logger.error(errorMsg, { component: 'Tool:write_json' });
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
