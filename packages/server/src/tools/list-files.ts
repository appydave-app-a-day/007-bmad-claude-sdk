/**
 * list_files Tool: List available HTML/CSS/JS files in /public directory
 *
 * Purpose:
 * - Enable agent to discover what web files exist
 * - Support fuzzy searching with optional pattern matching
 * - Solve the "which file should I modify?" problem
 *
 * Discovery Flow:
 * 1. User: "Show me the pages on the site"
 * 2. Agent: list_files() to see available files
 * 3. Agent: read_file("index.html") with confidence
 *
 * Security:
 * - Only lists files in /public directory (no path traversal)
 * - Returns filenames only (no content exposure)
 * - Filters for text-based web files only (no images)
 *
 * Usage (by agent):
 * Agent: "Let me see what web files are available"
 * Tool call: list_files() → ["index.html", "styles.css"]
 * Tool call: list_files({ pattern: "page" }) → ["pages/about.html", "page-styles.css"]
 */

import fs from 'fs/promises';
import path from 'path';
import { tool } from '@anthropic-ai/claude-agent-sdk';
import { z } from 'zod';
import { logger } from '../utils/logger.js';

// Public directory - all HTML/CSS/JS files served here
const PUBLIC_DIR = path.join(process.cwd(), 'public');

// Allowed file extensions (text-based web files only, no images)
const ALLOWED_EXTENSIONS = ['.html', '.css', '.js', '.jsx', '.ts', '.tsx'];

/**
 * List Files Tool Definition for Agent SDK
 * Discovers available web files with optional pattern matching
 */
export const listFilesTool = tool(
  'list_files',
  'List all HTML/CSS/JS files in the /public directory. Returns array of files with metadata. Use optional pattern to filter (e.g., "page" matches files with "page" in name).',
  {
    pattern: z.string().optional().describe('Optional search pattern to filter filenames (case-insensitive, partial match)'),
  },
  async (args) => {
    const { pattern } = args;

    try {
      logger.debug(`Listing files in public directory${pattern ? ` (pattern: "${pattern}")` : ''}`, {
        component: 'Tool:list_files',
      });

      // Read public directory
      const allFiles = await fs.readdir(PUBLIC_DIR);

      // Filter for allowed file types only (HTML/CSS/JS, no images)
      let webFiles = allFiles.filter((f) =>
        ALLOWED_EXTENSIONS.some(ext => f.endsWith(ext))
      );

      // Apply pattern filter if provided (case-insensitive partial match)
      if (pattern) {
        const lowerPattern = pattern.toLowerCase();
        webFiles = webFiles.filter((f) => f.toLowerCase().includes(lowerPattern));
      }

      // Get file stats for additional metadata
      const filesWithStats = await Promise.all(
        webFiles.map(async (filename) => {
          const filepath = path.join(PUBLIC_DIR, filename);
          const stats = await fs.stat(filepath);
          const ext = path.extname(filename);
          const typeMap: Record<string, string> = {
            '.html': 'html',
            '.css': 'css',
            '.js': 'javascript',
            '.jsx': 'javascript',
            '.ts': 'typescript',
            '.tsx': 'typescript',
          };
          return {
            filename,
            size: stats.size,
            modified: stats.mtime.toISOString(),
            type: typeMap[ext] || 'unknown',
          };
        })
      );

      logger.info(`Found ${filesWithStats.length} web file(s)`, {
        component: 'Tool:list_files',
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
      logger.error(`Error listing files: ${(error as Error).message}`, {
        component: 'Tool:list_files',
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
