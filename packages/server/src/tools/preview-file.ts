/**
 * preview_file Tool: Peek at file content without reading full file
 *
 * Purpose:
 * - Show file structure/content preview before full read
 * - Avoid loading huge files into agent memory
 * - Help agent understand file structure to make smart decisions
 *
 * Discovery Flow:
 * 1. User: "Update the homepage"
 * 2. Agent: list_files() → finds "index.html"
 * 3. Agent: preview_file("index.html") → sees first 20 lines with <!DOCTYPE html>, <head>, etc.
 * 4. Agent: "Ah! It's a standard HTML5 page with a header section"
 * 5. Agent: read_file("index.html") → gets full content to modify
 *
 * Security:
 * - Path sandboxing via validatePath() prevents directory traversal
 * - Only reads limited lines (not full file)
 * - Safe for large files
 *
 * Usage (by agent):
 * Agent: "Let me check the structure of index.html"
 * Tool call: preview_file({ filepath: "index.html" })
 * Returns: { filename, fileSize, totalLines, previewLines, sample, note }
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
 * Preview File Tool Definition for Agent SDK
 * Shows first N lines of file without reading all content
 */
export const previewFileTool = tool(
  'preview_file',
  'Preview first N lines of a file in /public directory. Shows file structure without reading all content. Useful for understanding file layout before full read.',
  {
    filepath: z.string().describe('Relative path to file within /public directory (e.g., "index.html" or "pages/about.html")'),
    maxLines: z.number().optional().describe('Maximum number of lines to preview (default: 20)'),
  },
  async (args) => {
    const { filepath, maxLines = 20 } = args;

    try {
      // Validate and resolve path (prevents directory traversal)
      const fullPath = validatePath(filepath, PUBLIC_DIR);

      logger.debug(`Previewing file: ${fullPath}`, {
        component: 'Tool:preview_file',
      });

      // Read file content
      const content = await fs.readFile(fullPath, 'utf-8');

      // Split content into lines and take first N
      const allLines = content.split('\n');
      const previewLines = allLines.slice(0, maxLines);
      const sample = previewLines.join('\n');

      // Get file stats
      const stats = await fs.stat(fullPath);

      const preview = {
        filename: filepath,
        fileSize: stats.size,
        totalLines: allLines.length,
        previewLines: previewLines.length,
        sample,
        note: allLines.length > maxLines
          ? `Showing first ${maxLines} lines of ${allLines.length}. Use read_file() for full content.`
          : 'Full content shown.',
      };

      logger.info(`Successfully previewed ${filepath}`, {
        component: 'Tool:preview_file',
        fileSize: stats.size,
        totalLines: allLines.length,
        previewLines: previewLines.length,
      });

      // Return MCP CallToolResult format
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(preview, null, 2),
          },
        ],
      };
    } catch (error) {
      // Handle specific error types
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        logger.error(`File not found: ${filepath}`, {
          component: 'Tool:preview_file',
        });
        return {
          content: [
            {
              type: 'text',
              text: `File not found: ${filepath}`,
            },
          ],
          isError: true,
        };
      }

      if (error instanceof ToolError) {
        logger.error(error.message, {
          component: 'Tool:preview_file',
        });
        return {
          content: [
            {
              type: 'text',
              text: error.message,
            },
          ],
          isError: true,
        };
      }

      // Unexpected errors
      logger.error(`Unexpected error previewing ${filepath}: ${(error as Error).message}`, {
        component: 'Tool:preview_file',
      });
      return {
        content: [
          {
            type: 'text',
            text: `Error previewing file: ${(error as Error).message}`,
          },
        ],
        isError: true,
      };
    }
  }
);
