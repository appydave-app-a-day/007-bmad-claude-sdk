/**
 * list_json Tool: List available JSON files in /data directory
 *
 * Purpose:
 * - Enable agent to discover what data files exist
 * - Support fuzzy searching with optional pattern matching
 * - Solve the "which file should I use?" problem
 *
 * Discovery Flow:
 * 1. User: "Show me products"
 * 2. Agent: list_json() to see available files
 * 3. Agent: read_json("products.json") with confidence
 *
 * Security:
 * - Only lists files in /data directory (no path traversal)
 * - Returns filenames only (no content exposure)
 *
 * Usage (by agent):
 * Agent: "Let me see what data files are available"
 * Tool call: list_json() → ["products.json", "users.json"]
 * Tool call: list_json({ pattern: "product" }) → ["products.json", "product-categories.json"]
 */

import fs from 'fs/promises';
import path from 'path';
import { tool } from '@anthropic-ai/claude-agent-sdk';
import { z } from 'zod';
import { logger } from '../utils/logger.js';

// Data directory - all JSON files stored here
const DATA_DIR = path.join(process.cwd(), 'data');

/**
 * List JSON Tool Definition for Agent SDK
 * Discovers available JSON files with optional pattern matching
 */
export const listJsonTool = tool(
  'list_json',
  'List all JSON files in the /data directory. Returns array of filenames. Use optional pattern to filter (e.g., "product" matches "products.json", "product-categories.json").',
  {
    pattern: z.string().optional().describe('Optional search pattern to filter filenames (case-insensitive, partial match)'),
  },
  async (args) => {
    const { pattern } = args;

    try {
      logger.debug(`Listing JSON files in data directory${pattern ? ` (pattern: "${pattern}")` : ''}`, {
        component: 'Tool:list_json',
      });

      // Read data directory
      const allFiles = await fs.readdir(DATA_DIR);

      // Filter for JSON files only
      let jsonFiles = allFiles.filter((f) => f.endsWith('.json'));

      // Apply pattern filter if provided (case-insensitive partial match)
      if (pattern) {
        const lowerPattern = pattern.toLowerCase();
        jsonFiles = jsonFiles.filter((f) => f.toLowerCase().includes(lowerPattern));
      }

      // Get file stats for additional metadata
      const filesWithStats = await Promise.all(
        jsonFiles.map(async (filename) => {
          const filepath = path.join(DATA_DIR, filename);
          const stats = await fs.stat(filepath);
          return {
            filename,
            size: stats.size,
            modified: stats.mtime.toISOString(),
          };
        })
      );

      logger.info(`Found ${filesWithStats.length} JSON file(s)`, {
        component: 'Tool:list_json',
        count: filesWithStats.length,
        pattern: pattern || 'none',
      });

      // Return MCP CallToolResult format
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                files: filesWithStats,
                count: filesWithStats.length,
                pattern: pattern || null,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error) {
      logger.error(`Error listing JSON files: ${(error as Error).message}`, {
        component: 'Tool:list_json',
      });

      return {
        content: [
          {
            type: 'text',
            text: `Error listing files: ${(error as Error).message}`,
          },
        ],
        isError: true,
      };
    }
  }
);
