/**
 * preview_json Tool: Peek at JSON file structure without reading full content
 *
 * Purpose:
 * - Show data schema/structure before full read
 * - Avoid loading huge files into agent memory
 * - Help agent understand data format to make smart decisions
 *
 * Discovery Flow:
 * 1. User: "Show me pet products"
 * 2. Agent: list_json() → finds "products.json"
 * 3. Agent: preview_json("products.json") → sees { products: [{ id, name, category }] }
 * 4. Agent: "Ah! It has a category field, I can filter for pets"
 * 5. Agent: read_json("products.json") → filters for category="pets"
 *
 * Security:
 * - Path sandboxing via validatePath() prevents directory traversal
 * - Only reads limited sample (not full file)
 * - Safe for large files
 *
 * Usage (by agent):
 * Agent: "Let me check the structure of products.json"
 * Tool call: preview_json({ filepath: "products.json" })
 * Returns: { keys: [...], sample: {...}, itemCount: 50 }
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
 * Helper: Get sample data from JSON (first N items of arrays)
 */
function getSample(data: any, maxItems: number = 3): any {
  if (Array.isArray(data)) {
    return data.slice(0, maxItems);
  }

  if (typeof data === 'object' && data !== null) {
    const sample: any = {};
    for (const [key, value] of Object.entries(data)) {
      if (Array.isArray(value)) {
        sample[key] = value.slice(0, maxItems);
      } else {
        sample[key] = value;
      }
    }
    return sample;
  }

  return data;
}

/**
 * Helper: Get item count for arrays in JSON
 */
function getItemCount(data: any): Record<string, number> | null {
  const counts: Record<string, number> = {};

  if (Array.isArray(data)) {
    return { items: data.length };
  }

  if (typeof data === 'object' && data !== null) {
    for (const [key, value] of Object.entries(data)) {
      if (Array.isArray(value)) {
        counts[key] = value.length;
      }
    }
    return Object.keys(counts).length > 0 ? counts : null;
  }

  return null;
}

/**
 * Preview JSON Tool Definition for Agent SDK
 * Shows structure and sample data without reading full file
 */
export const previewJsonTool = tool(
  'preview_json',
  'Preview the structure of a JSON file without reading all content. Shows top-level keys, sample data (first 3 items of arrays), and item counts. Useful for understanding data structure before full read.',
  {
    filepath: z.string().describe('Relative path to the JSON file within /data directory (e.g., "products.json")'),
    maxItems: z.number().optional().describe('Maximum number of array items to include in sample (default: 3)'),
  },
  async (args) => {
    const { filepath, maxItems = 3 } = args;

    try {
      // Validate and resolve path (prevents directory traversal)
      const fullPath = validatePath(filepath, DATA_DIR);

      logger.debug(`Previewing JSON file: ${fullPath}`, {
        component: 'Tool:preview_json',
      });

      // Read and parse JSON
      const content = await fs.readFile(fullPath, 'utf-8');
      const data = JSON.parse(content);

      // Get file stats
      const stats = await fs.stat(fullPath);

      // Extract metadata
      const keys = typeof data === 'object' && data !== null ? Object.keys(data) : [];
      const sample = getSample(data, maxItems);
      const itemCounts = getItemCount(data);

      const preview = {
        filename: filepath,
        fileSize: stats.size,
        topLevelKeys: keys,
        itemCounts,
        sample,
        note: itemCounts
          ? `Showing first ${maxItems} items of arrays. Use read_json() for full content.`
          : 'Full content shown (not an array or contains no arrays).',
      };

      logger.info(`Successfully previewed ${filepath}`, {
        component: 'Tool:preview_json',
        fileSize: stats.size,
        keyCount: keys.length,
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
          component: 'Tool:preview_json',
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

      if (error instanceof SyntaxError) {
        logger.error(`Invalid JSON in ${filepath}: ${error.message}`, {
          component: 'Tool:preview_json',
        });
        return {
          content: [
            {
              type: 'text',
              text: `Invalid JSON in ${filepath}: ${error.message}`,
            },
          ],
          isError: true,
        };
      }

      if (error instanceof ToolError) {
        logger.error(error.message, {
          component: 'Tool:preview_json',
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
        component: 'Tool:preview_json',
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
