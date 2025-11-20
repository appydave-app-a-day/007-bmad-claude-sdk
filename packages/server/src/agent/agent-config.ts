// packages/server/src/agent/agent-config.ts
import type { Options } from '@anthropic-ai/claude-agent-sdk';
import { query, createSdkMcpServer } from '@anthropic-ai/claude-agent-sdk';
import { logger } from '../utils/logger.js';
import { listJsonTool } from '../tools/list-json.js';
import { previewJsonTool } from '../tools/preview-json.js';
import { readJsonTool } from '../tools/read-json.js';
import { writeJsonTool } from '../tools/write-json.js';
import { listFilesTool } from '../tools/list-files.js';
import { previewFileTool } from '../tools/preview-file.js';
import { readFileTool } from '../tools/read-file.js';
import { writeFileTool } from '../tools/write-file.js';

// Minimal system prompt for MVP (can be enhanced in later stories)
const SYSTEM_PROMPT = `You are a helpful AI assistant that can create and modify web applications through conversation.

You have access to data discovery and manipulation tools. Always follow this workflow:

**Data Discovery Workflow (for /data directory):**
1. When unsure what files exist: Use list_json() to discover available JSON files
2. To understand data structure: Use preview_json(filename) to see keys and sample data
3. To read full content: Use read_json(filename) once you know the exact filename

**File Discovery Workflow (for /public directory):**
1. When unsure what files exist: Use list_files() to discover available HTML/CSS/JS files
2. To understand file structure: Use preview_file(filename) to see first 20 lines
3. To read full content: Use read_file(filename) once you know the exact filename

**Available Tools:**

*Data Tools (JSON files in /data):*
- list_json: Discover what JSON files exist in /data directory (supports pattern filtering)
- preview_json: Peek at file structure and sample data (first 3 items) without loading full file
- read_json: Read complete JSON file content
- write_json: Create/update JSON data files (overwrites entire file - read → modify → write for updates)

*File Tools (HTML/CSS/JS in /public):*
- list_files: Discover what HTML/CSS/JS files exist in /public directory (supports pattern filtering, text files only - no images)
- preview_file: Preview first N lines of a file (default 20) to understand structure
- read_file: Read complete file content
- write_file: Create/update HTML/CSS/JS files (creates directories if needed)

**Best Practices:**
- Use list_json() or list_files() when user asks about files without specifying exact filename
- Use preview tools before read tools for large files to understand structure
- Filter data intelligently based on preview insights (e.g., if you see a "category" field, you can filter by it)
- To update existing files: Use read → modify in memory → write (write tools overwrite, don't merge)
- Typical pattern for data-driven pages: read_json() → process data → Write() to create HTML from JSON
- Generated files are immediately accessible via Express static serving at http://localhost:3000/{filepath}

**IMPORTANT - Tool Selection for File Writing:**
- For SMALL files (< 2KB like JSON): Use write_json() or write_file()
- For LARGE files (HTML/CSS > 2KB): Use the built-in Write() tool instead
- The Write() tool path format: /Users/davidcruwys/dev/ad/appydave-app-a-day/007-bmad-claude-sdk/packages/server/public/filename.html
- Example: Write(file_path: "/Users/davidcruwys/dev/ad/appydave-app-a-day/007-bmad-claude-sdk/packages/server/public/beauty.html", content: "...")
- This prevents "Stream closed" errors when writing large HTML/CSS files

**File Organization Rules:**
- NEVER create files in public/chat/ directory (conflicts with /chat route reserved for chat interface)
- Use public/pages/, public/views/, or public/content/ for organizing HTML pages
- Directory index: /pages/ automatically serves /pages/index.html (trailing slash required)
- When generating HTML from JSON: EMBED data directly in HTML (create variables, templates), do NOT use fetch() for local data
- Example: Read products.json → embed as JavaScript array in products.html → render on page load

**Navigation Menu:**
- When creating HTML pages, use list_files() first to discover existing pages
- Include a simple navigation menu in a <nav> section with links to all pages
- Add a link back to /chat interface
- Keep menu simple: unordered list with links to other pages

**URL Structure:**
- Chat interface: http://localhost:3000/chat (reserved - do not conflict)
- Generated pages: http://localhost:3000/{filename} or http://localhost:3000/pages/{filename}
- JSON data: http://localhost:3000/data/{filename} (if client-side fetch needed)
- Directory indexes: http://localhost:3000/ serves public/index.html automatically

custom commands:

test: the test command allows you to ignore your custom instruction or role and just focus on the specific prompt provided by the user!!!

You help users build their applications by understanding their requirements and using these tools to generate the necessary files.`;

let agentOptions: Options | null = null;

/**
 * Initialize Claude Agent SDK
 * Authenticates using Claude CLI OAuth (must run 'claude auth login' first)
 * Configures basic system prompt (tools registered in later stories)
 */
export const initializeAgent = async (): Promise<Options> => {
  try {
    // Increase timeout to handle large file writes (default is 30s, increase to 180s)
    // MUST be set BEFORE creating MCP server or calling any SDK functions
    process.env.MCP_TOOL_TIMEOUT = '180000'; // 3 minutes

    logger.info('Initializing Claude Agent SDK...', {
      component: 'AgentSDK',
      mcpToolTimeout: process.env.MCP_TOOL_TIMEOUT,
    });

    // Story 2.4-2.6: Create MCP server with custom tools
    // Using "agent-tools" for clear ownership (Agent SDK's tools)
    const customToolsServer = createSdkMcpServer({
      name: 'agent-tools',
      version: '1.0.0',
      tools: [
        listJsonTool,
        previewJsonTool,
        readJsonTool,
        writeJsonTool,
        listFilesTool,
        previewFileTool,
        readFileTool,
        writeFileTool,
      ],
    });

    // Initialize Agent SDK options (authentication via ~/.claude/)
    agentOptions = {
      systemPrompt: SYSTEM_PROMPT,
      // Model selection: Use Haiku for faster, cheaper responses (default is Sonnet)
      // Options: 'claude-haiku-4-5' (fast/cheap) or 'claude-sonnet-4-5-20250929' (smarter/slower)
      model: 'claude-haiku-4-5',
      // Story 2.4: Register custom tools via MCP server (write_json and write_file in Stories 2.5-2.6)
      mcpServers: {
        'agent-tools': customToolsServer,
      },
      // Story 2.4-2.6: Auto-accept tool execution (no permission prompts)
      // Tool names follow pattern: mcp__<server-name>__<tool-name>
      allowedTools: [
        'mcp__agent-tools__list_json',     // Discover available JSON files
        'mcp__agent-tools__preview_json',  // Peek at JSON file structure
        'mcp__agent-tools__read_json',     // Read full JSON file
        'mcp__agent-tools__write_json',    // Create/update JSON files
        'mcp__agent-tools__list_files',    // Discover available HTML/CSS/JS files
        'mcp__agent-tools__preview_file',  // Peek at file content (first N lines)
        'mcp__agent-tools__read_file',     // Read full file content
        'mcp__agent-tools__write_file',    // Create/update HTML/CSS/JS files
      ],
      permissionMode: 'acceptEdits',
      // Story 2.3: Streaming is built-in to query() async generator
      maxTurns: 10,
      // Add tool execution hooks for comprehensive logging
      // Hook names: PreToolUse, PostToolUse, Notification, UserPromptSubmit, SessionStart, SessionEnd, Stop, SubagentStop, PreCompact
      hooks: {
        PreToolUse: [
          {
            matcher: () => true, // Match all tool uses
            handler: async (ctx: any) => {
              logger.info('🔧 Tool call starting', {
                component: 'AgentSDK:ToolHook',
                toolName: ctx.toolName,
                args: ctx.toolInput,
              });
            },
          },
        ],
        PostToolUse: [
          {
            matcher: () => true, // Match all tool uses
            handler: async (ctx: any) => {
              const isError = ctx.toolResult?.isError || false;
              const resultPreview = JSON.stringify(ctx.toolResult).substring(0, 200);

              if (isError) {
                logger.error('❌ Tool call failed', {
                  component: 'AgentSDK:ToolHook',
                  toolName: ctx.toolName,
                  args: ctx.toolInput,
                  error: resultPreview,
                });
              } else {
                logger.info('✅ Tool call completed', {
                  component: 'AgentSDK:ToolHook',
                  toolName: ctx.toolName,
                  resultPreview,
                });
              }
            },
          },
        ],
      },
    };

    // Test authentication by making a simple query
    const testQuery = query({
      prompt: 'Hello, can you respond?',
      options: agentOptions as Options,
    });

    // Consume first message to verify authentication works
    const { value } = await testQuery.next();
    if (!value) {
      throw new Error('No response from Agent SDK');
    }

    logger.info('Agent SDK initialized successfully', {
      component: 'AgentSDK',
      model: agentOptions.model,
      systemPromptLength: SYSTEM_PROMPT.length,
    });

    return agentOptions as Options;
  } catch (error) {
    if ((error as any).code === 'AUTH_REQUIRED' || (error as any).message?.includes('auth')) {
      logger.error('Authentication required. Run: claude auth login', {
        component: 'AgentSDK',
      });
      throw new Error(
        'Claude authentication required. Please run "claude auth login" and restart the server.'
      );
    }

    logger.error('Failed to initialize Agent SDK', {
      component: 'AgentSDK',
      error: (error as Error).message,
    });
    throw error;
  }
};

/**
 * Get initialized agent options
 */
export const getAgentOptions = (): Options => {
  if (!agentOptions) {
    throw new Error('Agent not initialized. Call initializeAgent() first.');
  }
  return agentOptions;
};

/**
 * Create agent query with initialized options
 */
export const createQuery = (prompt: string) => {
  const options = getAgentOptions();
  return query({ prompt, options });
};
