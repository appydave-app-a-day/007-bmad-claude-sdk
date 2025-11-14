# BMAD + Claude SDK Self-Editing App Fullstack Architecture Document

## Introduction

This document outlines the complete fullstack architecture for **BMAD + Claude SDK Self-Editing App**, including backend systems, frontend implementation, and their integration. It serves as the single source of truth for AI-driven development, ensuring consistency across the entire technology stack.

This unified approach combines what would traditionally be separate backend and frontend architecture documents, streamlining the development process for modern fullstack applications where these concerns are increasingly intertwined.

### Starter Template or Existing Project

**N/A - Greenfield project**

This is a greenfield educational demonstration project built from scratch. While it follows proven patterns from the Storyline App (NPM workspaces monorepo), it is not based on any starter template or existing codebase.

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-11-14 | 1.0 | Initial architecture document creation | Winston (Architect) |

---

## High Level Architecture

### Technical Summary

This architecture implements a **monorepo-based, conversational web application** that enables users to build and modify software through natural language chat. The system uses **NPM workspaces** to organize three packages (server, client, shared), with an **Express 5 backend** running the Claude Agent SDK event loop and a **React 19 + Vite 7 frontend** providing the chat interface. Real-time bidirectional communication flows through **Socket.io**, streaming agent responses as they're generated. The backend exposes three domain-agnostic custom tools (`read_json`, `write_json`, `write_file`) that enable the agent to manipulate JSON data files and generate HTML/CSS/JS pages through conversation. This minimal framework (~200-250 LOC) demonstrates how Claude Agent SDK can be integrated with quality gates while maintaining educational clarity, deployed locally on `localhost:3000` (Express) with Vite dev server on `localhost:5173`.

### Platform and Infrastructure Choice

**Platform:** Local Development (Localhost)
**Key Services:**
- Node.js 20+ runtime (server execution)
- Express 5 (HTTP server + static file serving)
- Socket.io (WebSocket server for real-time streaming)
- Vite 7 dev server (frontend HMR during development)
- Claude Agent SDK (via OAuth, no separate service)
- File system (JSON in `/data`, HTML/CSS/JS in `/public`)

**Deployment Host and Regions:** Single-user localhost only for MVP (no cloud deployment)

### Repository Structure

**Structure:** Monorepo (single repository, multiple packages)
**Monorepo Tool:** NPM Workspaces (native npm functionality, no additional tooling)
**Package Organization:** Three-package structure with shared TypeScript types

```
packages/
├── server/          # Express + Agent SDK backend
├── client/          # React + Vite frontend
├── shared/          # Shared TypeScript types/utilities
```

### High Level Architecture Diagram

```mermaid
graph TB
    User[User Browser]

    subgraph "Frontend (localhost:5173)"
        ChatUI[React Chat Interface<br/>shadcn/ui + Vercel AI Elements]
        SocketClient[Socket.io Client]
    end

    subgraph "Backend (localhost:3000)"
        Express[Express 5 Server]
        SocketServer[Socket.io Server]
        EventLoop[Agent Event Loop]
        AgentSDK[Claude Agent SDK]

        subgraph "Custom Tools"
            ReadJSON[read_json]
            WriteJSON[write_json]
            WriteFile[write_file]
        end

        FileSystem[(File System)]
    end

    Claude[Claude API<br/>via OAuth]

    User -->|HTTPS| ChatUI
    ChatUI <-->|WebSocket| SocketClient
    SocketClient <-->|Real-time Stream| SocketServer
    SocketServer <--> EventLoop
    EventLoop <--> AgentSDK
    AgentSDK -->|Tool Calls| ReadJSON
    AgentSDK -->|Tool Calls| WriteJSON
    AgentSDK -->|Tool Calls| WriteFile
    ReadJSON <-->|/data/*.json| FileSystem
    WriteJSON <-->|/data/*.json| FileSystem
    WriteFile <-->|/public/*.html| FileSystem
    AgentSDK <-->|Authenticated Requests| Claude
    Express -->|Serve Generated Pages| User

    style ChatUI fill:#e1f5ff
    style AgentSDK fill:#fff4e1
    style FileSystem fill:#f0f0f0
```

### Architectural Patterns

- **Monorepo Architecture** - Single repository with NPM workspaces for server, client, and shared packages - _Rationale:_ Enables shared TypeScript types, atomic commits, and simplified dependency management for educational demo
- **Event-Driven Agent Loop** - Agent SDK processes messages through event-driven loop with custom tool integration - _Rationale:_ Clean separation of concerns, testable incremental build (basic → streaming → tools), educational clarity
- **Domain-Agnostic Tools Pattern** - Three generic file operation tools (read_json, write_json, write_file) with no business logic - _Rationale:_ Framework doesn't "know about" products/blogs, evolves based on conversation, demonstrates extensibility
- **Real-Time Streaming (Socket.io)** - Bidirectional WebSocket communication for streaming agent responses - _Rationale:_ Superior UX for progressive response display, handles backpressure, works across all browsers
- **Path Sandboxing** - Strict enforcement of writable directories (`/data` and `/public` only) - _Rationale:_ Security constraint for educational demo, prevents accidental system file modification
- **Component-Based UI (React)** - Reusable React components with TypeScript for type safety - _Rationale:_ Modern best practice, extensive ecosystem, familiar to target developers
- **Utility-First CSS (TailwindCSS)** - Atomic CSS classes for rapid styling - _Rationale:_ Minimal custom CSS, consistent design system, fast iteration
- **Shared Type System** - TypeScript interfaces in `/packages/shared` consumed by both frontend and backend - _Rationale:_ Eliminates type mismatches, enables refactoring confidence, educational value for monorepo patterns

---

## Tech Stack

This is the **DEFINITIVE** technology selection for the entire project. All development must use these exact versions.

### Technology Stack Table

| Category | Technology | Version | Purpose | Rationale |
|----------|-----------|---------|---------|-----------|
| Frontend Language | TypeScript | 5.7+ | Type-safe frontend development | Catches errors at compile time, excellent IDE support, industry standard for React apps |
| Frontend Framework | React | 19.x (latest stable) | UI component framework | Mature ecosystem, excellent documentation, familiar to target developers, component model matches agent-generated UI |
| UI Component Library | shadcn/ui | Latest | Headless UI primitives | Accessible components, TailwindCSS integration, copy-paste approach (not npm dependency hell), professional look with minimal effort |
| State Management | React useState/useContext | Built-in | Chat message state | MVP needs are simple (message history), avoid Redux/Zustand complexity, built-in hooks sufficient |
| Backend Language | TypeScript | 5.7+ | Type-safe server development | Shared types with frontend via `/packages/shared`, Node.js compatibility, async/await support |
| Backend Framework | Express | 5.x | HTTP server + routing | Mature, minimal, well-documented, handles both API and static file serving, Socket.io integration proven |
| API Style | Socket.io Events | 4.x | Real-time bidirectional communication | Not REST/GraphQL - event-based for streaming, bidirectional (client sends message, server streams chunks), WebSocket with fallbacks |
| Database | JSON Files | N/A (fs/promises) | Simple file-based persistence | No database for MVP, `fs/promises` for async file I/O, keeps deployment simple, educational transparency |
| Cache | None | N/A | No caching layer for MVP | Agent responses non-cacheable (conversational context), static files served by Express (browser caching sufficient) |
| File Storage | Local File System | N/A (Node.js fs) | JSON data + HTML/CSS/JS output | `/data` for JSON, `/public` for generated pages, sandboxed paths, no cloud storage complexity |
| Authentication | Claude CLI OAuth | N/A (claude auth login) | Claude API access | No API key management, uses existing Claude Pro/Team subscription, single-user localhost only |
| Frontend Testing | None (MVP) | N/A | No testing framework for MVP | Manual testing during development, future: Vitest for unit tests, Playwright for E2E |
| Backend Testing | None (MVP) | N/A | No testing framework for MVP | Manual testing, future: Vitest for tool tests, integration tests for event loop |
| E2E Testing | None (MVP) | N/A | No E2E framework for MVP | Manual browser testing, future: Playwright for full workflow tests |
| Build Tool | Vite | 7.x | Frontend dev server + bundler | Fast HMR, React plugin, TypeScript support, production builds, modern ESM-first approach |
| Bundler | Vite (esbuild) | Built-in | Frontend code bundling | esbuild-powered (fast), handles TypeScript + JSX, single tool for dev + prod |
| IaC Tool | None | N/A | No infrastructure as code | Localhost-only deployment, no cloud infrastructure, future: Docker for containerization |
| CI/CD | None (MVP) | N/A | No continuous integration | GitHub repo only, no automated testing or deployment, future: GitHub Actions for PR checks |
| Monitoring | Console Logging | N/A (custom logger.ts) | Development visibility | Structured console logs with colors, component-based (AgentEventLoop, Tool:read_json, Socket), debug mode via DEBUG=true |
| Logging | Custom Logger Utility | N/A (logger.ts) | Consistent log format | `[timestamp] [component] message [data]`, info/warn/error/debug levels, color-coded for development |
| CSS Framework | TailwindCSS | 4.x | Utility-first styling | Atomic CSS, design system consistency, dark mode support, minimal custom CSS, shadcn/ui integration |

---

## Data Models

Since this is a **meta-framework** with domain-agnostic tools, the core data models focus on the **framework itself** rather than application-specific entities (like products or blogs). The framework provides the structure for the agent to create arbitrary data models through conversation.

### Framework Message Model

**Purpose:** Represents chat messages exchanged between user and agent in the conversation interface.

**Key Attributes:**
- `id`: string - Unique message identifier (UUID or timestamp-based)
- `role`: 'user' | 'assistant' - Message sender (user or Claude agent)
- `content`: string - Message text content (markdown supported for agent responses)
- `timestamp`: number - Unix timestamp when message was created
- `status`: 'sending' | 'complete' | 'error' - Message delivery status

**TypeScript Interface:**

```typescript
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  status: 'sending' | 'complete' | 'error';
}
```

**Relationships:**
- Part of `ChatHistory` array in client state
- Emitted via Socket.io events between client and server
- No persistence (MVP) - conversation history lost on page refresh

### Agent Tool Call Model

**Purpose:** Represents a custom tool invocation by the Claude Agent SDK during conversation processing.

**Key Attributes:**
- `toolName`: 'read_json' | 'write_json' | 'write_file' - Which tool was invoked
- `parameters`: object - Tool-specific parameters (filepath, content, etc.)
- `result`: object | string - Tool execution result returned to agent
- `timestamp`: number - When tool was called
- `error`: string | null - Error message if tool execution failed

**TypeScript Interface:**

```typescript
interface ToolCall {
  toolName: 'read_json' | 'write_json' | 'write_file';
  parameters: {
    filepath: string;
    content?: any; // For write operations
  };
  result?: any;
  error?: string | null;
  timestamp: number;
}
```

**Relationships:**
- Logged by Agent Event Loop for debugging/transparency
- Part of Agent SDK execution flow
- Not exposed to frontend (backend-only model)

### Socket Event Model

**Purpose:** Defines the Socket.io event structure for client-server communication.

**Key Attributes:**
- `event`: string - Event name ('user_message', 'agent_response_chunk', 'agent_response_complete', 'error')
- `payload`: object - Event-specific data
- `timestamp`: number - When event was emitted

**TypeScript Interface:**

```typescript
// Client → Server
interface UserMessageEvent {
  event: 'user_message';
  payload: {
    content: string;
    messageId: string;
  };
}

// Server → Client (streaming chunks)
interface AgentResponseChunkEvent {
  event: 'agent_response_chunk';
  payload: {
    chunk: string;
    messageId: string;
  };
}

// Server → Client (stream complete)
interface AgentResponseCompleteEvent {
  event: 'agent_response_complete';
  payload: {
    messageId: string;
  };
}

// Server → Client (errors)
interface ErrorEvent {
  event: 'error';
  payload: {
    message: string;
    code?: string;
  };
}

type SocketEvent =
  | UserMessageEvent
  | AgentResponseChunkEvent
  | AgentResponseCompleteEvent
  | ErrorEvent;
```

**Relationships:**
- Emitted by Socket.io client and server
- Drives real-time chat interface updates
- Couples frontend and backend communication contract

### Application Data Models (User-Generated)

**Purpose:** The framework intentionally does NOT define application-specific models. Instead, users create arbitrary JSON structures through conversation.

**Example (Generated via Conversation):**

```typescript
// Example: User asks "create a product catalog"
// Agent would create /data/products.json:
interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
}

// Example: User asks "create a blog system"
// Agent would create /data/blog-posts.json:
interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  publishedAt: string;
  tags: string[];
}
```

**Key Design Principle:**

The framework's tools (`read_json`, `write_json`, `write_file`) are **domain-agnostic**. They don't validate schemas or enforce structure. The agent and user collaboratively define data models through conversation, and the framework simply persists whatever JSON structure they create.

---

## API Specification

This application uses **Socket.io event-based communication** rather than traditional REST/GraphQL APIs. The primary interface is real-time bidirectional events between client and server.

### Socket.io Event Specification

**Connection:**

```typescript
// Client connects to Socket.io server
const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
```

**Client → Server Events:**

```typescript
// Event: user_message
// Description: User sends a chat message to the agent
// Payload:
{
  event: 'user_message',
  data: {
    content: string,      // User's message text
    messageId: string     // Client-generated UUID for tracking
  }
}

// Example:
socket.emit('user_message', {
  content: 'Create a product catalog with 3 items',
  messageId: 'msg_abc123'
});
```

**Server → Client Events:**

```typescript
// Event: agent_response_chunk
// Description: Server streams agent response in chunks (real-time)
// Payload:
{
  event: 'agent_response_chunk',
  data: {
    chunk: string,        // Text chunk from Claude Agent SDK
    messageId: string     // Matches original user message ID
  }
}

// Example:
socket.on('agent_response_chunk', (data) => {
  console.log('Chunk received:', data.chunk);
  // Append chunk to current agent message in UI
});

// Event: agent_response_complete
// Description: Agent response streaming finished
// Payload:
{
  event: 'agent_response_complete',
  data: {
    messageId: string     // Matches original user message ID
  }
}

// Example:
socket.on('agent_response_complete', (data) => {
  console.log('Response complete for message:', data.messageId);
  // Hide loading indicator, finalize message display
});

// Event: error
// Description: Server error (tool execution failure, agent error, etc.)
// Payload:
{
  event: 'error',
  data: {
    message: string,      // Human-readable error message
    code?: string,        // Optional error code (TOOL_ERROR, AGENT_ERROR, etc.)
    messageId?: string    // Associated message ID if applicable
  }
}

// Example:
socket.on('error', (data) => {
  console.error('Error:', data.message);
  // Display error to user in chat interface
});
```

### HTTP REST Endpoints (Minimal)

While Socket.io handles chat communication, the Express server provides a few HTTP endpoints:

```yaml
# Health Check Endpoint
GET /api/health
Description: Server health check
Response:
  200 OK
  Content-Type: application/json
  Body:
    {
      "status": "ok",
      "timestamp": 1699999999999,
      "version": "1.0.0"
    }

# Static File Serving (Generated Pages)
GET /
GET /{path}
Description: Serve generated HTML/CSS/JS from /public directory
Examples:
  - GET / → serves /public/index.html
  - GET /products → serves /public/products.html
  - GET /blog → serves /public/blog.html
Response:
  200 OK (if file exists)
  404 Not Found (if file doesn't exist)
  Content-Type: text/html, text/css, application/javascript (based on file extension)

# Chat Interface (React App)
GET /chat
Description: Serve React chat interface
Response:
  200 OK
  Content-Type: text/html
  Body: React app (served by Vite dev server in development, Express in production)
```

### Agent Tool Interface (Internal - Not Exposed to Client)

These are the three custom tools registered with Claude Agent SDK. They are **not** HTTP endpoints - they're TypeScript functions called by the agent during conversation processing.

```typescript
// Tool: read_json
// Description: Read JSON file from /data directory
// Parameters:
{
  filepath: string      // Relative path within /data (e.g., "products.json")
}
// Returns:
{
  success: true,
  data: any             // Parsed JSON content
}
// OR
{
  success: false,
  error: string         // Error message (file not found, invalid JSON, path traversal)
}

// Tool: write_json
// Description: Write/update JSON file in /data directory
// Parameters:
{
  filepath: string,     // Relative path within /data (e.g., "products.json")
  content: any          // JSON-serializable content
}
// Returns:
{
  success: true,
  message: string       // Confirmation message
}
// OR
{
  success: false,
  error: string         // Error message
}

// Tool: write_file
// Description: Write/update HTML/CSS/JS file in /public directory
// Parameters:
{
  filepath: string,     // Relative path within /public (e.g., "index.html")
  content: string       // File content (HTML, CSS, or JavaScript)
}
// Returns:
{
  success: true,
  message: string       // Confirmation message
}
// OR
{
  success: false,
  error: string         // Error message
}
```

**Tool Registration Example:**

```typescript
const tools = [
  {
    name: 'read_json',
    description: 'Read JSON data from a file in the /data directory',
    parameters: {
      type: 'object',
      properties: {
        filepath: {
          type: 'string',
          description: 'Relative path to JSON file within /data directory'
        }
      },
      required: ['filepath']
    },
    handler: async (params) => {
      // Implementation in src/tools/read-json.ts
    }
  },
  // ... write_json and write_file tools
];
```

---

## Components

This section defines the major logical components across the fullstack architecture.

### Express Server (Backend Entry Point)

**Responsibility:** HTTP server initialization, static file serving, Socket.io server setup, and routing

**Key Interfaces:**
- HTTP endpoint: `/api/health` (health check)
- Static file routes: `/` and `/{path}` (serve from `/public`)
- Chat interface route: `/chat` (serve React app)
- Socket.io endpoint: WebSocket connection on same port (3000)

**Dependencies:**
- Express framework
- Socket.io server
- Agent Event Loop component
- File system (serve static files)

**Technology Stack:**
- Express 5 + TypeScript
- Socket.io 4.x server
- Node.js fs module for static serving
- CORS middleware (allow Vite dev server)

**Location:** `packages/server/src/server.ts`

### Agent Event Loop (Core Backend Logic)

**Responsibility:** Orchestrate conversation flow between Socket.io events, Claude Agent SDK, and custom tools

**Key Interfaces:**
- `handleUserMessage(message: string, messageId: string): AsyncIterator<string>` - Process user message, return streaming response
- `initializeAgent(): void` - Initialize Claude Agent SDK with system prompt and tools
- Event handlers for Socket.io events (`user_message`)

**Dependencies:**
- Claude Agent SDK (agent execution)
- Custom tools (read_json, write_json, write_file)
- Socket.io server (emit response chunks)
- Logger utility (structured logging)

**Technology Stack:**
- TypeScript
- Claude Agent SDK (`@anthropic-ai/claude-agent-sdk`)
- Socket.io for event emission
- Custom logger utility

**Location:** `packages/server/src/agent/event-loop.ts`

**Implementation Notes:**
- Incremental build pattern: Basic (Story 2.2) → Streaming (Story 2.3) → Tools (Stories 2.4-2.6)
- Educational clarity: Comprehensive inline comments explaining SDK integration
- Error handling: Try/catch blocks with user-friendly error messages emitted via Socket.io

### Custom Tools (Backend Utilities)

**Responsibility:** Provide domain-agnostic file operations for the agent (read/write JSON, write HTML/CSS/JS)

**Key Interfaces:**
- `readJson(filepath: string): Promise<any>` - Read and parse JSON from `/data`
- `writeJson(filepath: string, content: any): Promise<void>` - Write JSON to `/data`
- `writeFile(filepath: string, content: string): Promise<void>` - Write HTML/CSS/JS to `/public`

**Dependencies:**
- Node.js `fs/promises` (async file operations)
- Path sandboxing utility (validate paths within allowed directories)
- Error handling utility (ToolError class)
- Logger utility

**Technology Stack:**
- TypeScript
- Node.js fs/promises
- Path validation logic

**Location:**
- `packages/server/src/tools/read-json.ts`
- `packages/server/src/tools/write-json.ts`
- `packages/server/src/tools/write-file.ts`

**Security:** All tools enforce path sandboxing - only `/data` and `/public` directories writable

### Socket.io Server Manager (Backend Communication)

**Responsibility:** Manage WebSocket connections, route events to Agent Event Loop, emit streaming responses

**Key Interfaces:**
- `initialize(httpServer: http.Server): void` - Attach Socket.io to Express server
- Event listener: `user_message` → forward to Agent Event Loop
- Event emitter: `agent_response_chunk`, `agent_response_complete`, `error`

**Dependencies:**
- Express HTTP server (attachment point)
- Agent Event Loop (message processing)
- Logger utility

**Technology Stack:**
- Socket.io 4.x server
- TypeScript
- Express HTTP server instance

**Location:** `packages/server/src/socket/socket-manager.ts`

### React Chat Interface (Frontend UI)

**Responsibility:** Display chat messages, handle user input, manage WebSocket connection, render streaming responses

**Key Interfaces:**
- `ChatInterface` component (main UI)
- `MessageList` component (scrollable message history)
- `MessageInput` component (text input + send button)
- `ThemeToggle` component (light/dark mode switch)

**Dependencies:**
- Socket.io client (WebSocket connection)
- shadcn/ui components (Button, Input, ScrollArea, Card)
- Vercel AI Elements (chat UI patterns)
- React state hooks (useState for messages, useContext for theme)

**Technology Stack:**
- React 19 + TypeScript
- Socket.io-client 4.x
- shadcn/ui components
- TailwindCSS 4 for styling
- Vercel AI SDK UI utilities

**Location:** `packages/client/src/components/ChatInterface.tsx`

**State Management:**
- `messages: ChatMessage[]` - Message history (useState)
- `isStreaming: boolean` - Agent response in progress (useState)
- `theme: 'light' | 'dark'` - Theme preference (useContext + localStorage)

### Socket.io Client Manager (Frontend Communication)

**Responsibility:** Establish WebSocket connection, emit user messages, receive streaming chunks, handle reconnection

**Key Interfaces:**
- `connectSocket(): Socket` - Initialize Socket.io client
- `sendMessage(content: string, messageId: string): void` - Emit user_message event
- Event handlers: `agent_response_chunk`, `agent_response_complete`, `error`, `connect`, `disconnect`

**Dependencies:**
- Socket.io client library
- React hooks (useEffect for connection lifecycle)

**Technology Stack:**
- Socket.io-client 4.x
- TypeScript
- React useEffect hook

**Location:** `packages/client/src/hooks/useSocket.ts` (custom React hook)

### Shared Types Package (Cross-Cutting)

**Responsibility:** Provide TypeScript interfaces used by both frontend and backend

**Key Interfaces:**
- `ChatMessage` interface
- `SocketEvent` union types
- `ToolCall` interface
- `ToolResult` type

**Dependencies:** None (pure TypeScript types)

**Technology Stack:** TypeScript

**Location:** `packages/shared/src/types.ts`

**Purpose:** Eliminate type mismatches between client and server, enable refactoring confidence

### Utility Components (Backend)

**Responsibility:** Reusable utilities for logging, error handling, path validation

**Key Interfaces:**
- Logger: `logger.info()`, `logger.warn()`, `logger.error()`, `logger.debug()`
- ToolError: Custom error class for tool failures
- Path validator: `validatePath(filepath: string, allowedDir: string): string`

**Dependencies:** None (standalone utilities)

**Technology Stack:** TypeScript, Node.js

**Location:**
- `packages/server/src/utils/logger.ts`
- `packages/server/src/utils/errors.ts`
- `packages/server/src/utils/path-validator.ts`

### Component Diagram

```mermaid
graph TB
    subgraph "Frontend (packages/client)"
        ChatUI[ChatInterface Component]
        MessageList[MessageList Component]
        MessageInput[MessageInput Component]
        ThemeToggle[ThemeToggle Component]
        SocketClient[Socket Client Manager]
    end

    subgraph "Backend (packages/server)"
        ExpressServer[Express Server]
        SocketServer[Socket.io Server Manager]
        EventLoop[Agent Event Loop]
        AgentSDK[Claude Agent SDK]

        subgraph "Custom Tools"
            ReadJSON[read_json Tool]
            WriteJSON[write_json Tool]
            WriteFile[write_file Tool]
        end

        subgraph "Utilities"
            Logger[Logger Utility]
            ErrorHandler[Error Handler]
            PathValidator[Path Validator]
        end
    end

    subgraph "Shared (packages/shared)"
        Types[Shared TypeScript Types]
    end

    ChatUI --> MessageList
    ChatUI --> MessageInput
    ChatUI --> ThemeToggle
    ChatUI --> SocketClient

    SocketClient <-->|WebSocket| SocketServer
    SocketServer --> EventLoop
    EventLoop --> AgentSDK
    AgentSDK --> ReadJSON
    AgentSDK --> WriteJSON
    AgentSDK --> WriteFile

    ReadJSON --> PathValidator
    WriteJSON --> PathValidator
    WriteFile --> PathValidator

    EventLoop --> Logger
    SocketServer --> Logger
    ReadJSON --> Logger
    WriteJSON --> Logger
    WriteFile --> Logger

    ReadJSON --> ErrorHandler
    WriteJSON --> ErrorHandler
    WriteFile --> ErrorHandler

    ExpressServer --> SocketServer

    ChatUI -.->|imports| Types
    SocketClient -.->|imports| Types
    EventLoop -.->|imports| Types
    SocketServer -.->|imports| Types

    style ChatUI fill:#e1f5ff
    style EventLoop fill:#fff4e1
    style Types fill:#f0f0f0
```

---

## Core Workflows

These sequence diagrams illustrate the key system workflows showing component interactions.

### User Message → Agent Response (Happy Path)

```mermaid
sequenceDiagram
    participant User
    participant ChatUI as Chat Interface
    participant SocketClient as Socket.io Client
    participant SocketServer as Socket.io Server
    participant EventLoop as Agent Event Loop
    participant AgentSDK as Claude Agent SDK
    participant Claude as Claude API

    User->>ChatUI: Types message & clicks Send
    ChatUI->>ChatUI: Generate messageId (UUID)
    ChatUI->>ChatUI: Add user message to state
    ChatUI->>SocketClient: sendMessage(content, messageId)
    SocketClient->>SocketServer: emit('user_message', {content, messageId})

    SocketServer->>EventLoop: handleUserMessage(content, messageId)
    EventLoop->>EventLoop: Log: "Processing message"
    EventLoop->>AgentSDK: processMessage(content)
    AgentSDK->>Claude: Send message with system prompt

    loop Streaming Response
        Claude-->>AgentSDK: Response chunk
        AgentSDK-->>EventLoop: Yield chunk
        EventLoop->>SocketServer: Emit chunk
        SocketServer->>SocketClient: emit('agent_response_chunk', {chunk, messageId})
        SocketClient->>ChatUI: Update current message
        ChatUI->>User: Display chunk (progressive update)
    end

    AgentSDK-->>EventLoop: Stream complete
    EventLoop->>SocketServer: Emit complete
    SocketServer->>SocketClient: emit('agent_response_complete', {messageId})
    SocketClient->>ChatUI: Finalize message
    ChatUI->>User: Show complete message
```

### Agent Tool Invocation (write_json Example)

```mermaid
sequenceDiagram
    participant User
    participant ChatUI as Chat Interface
    participant SocketClient as Socket.io Client
    participant SocketServer as Socket.io Server
    participant EventLoop as Agent Event Loop
    participant AgentSDK as Claude Agent SDK
    participant WriteJSON as write_json Tool
    participant PathValidator as Path Validator
    participant FileSystem as File System
    participant Logger as Logger

    User->>ChatUI: "Create a product catalog with 3 items"
    ChatUI->>SocketClient: emit('user_message')
    SocketClient->>SocketServer: Forward message
    SocketServer->>EventLoop: handleUserMessage()
    EventLoop->>AgentSDK: processMessage()

    AgentSDK->>AgentSDK: Decides to use write_json tool
    AgentSDK->>WriteJSON: invoke({filepath: "products.json", content: {...}})

    WriteJSON->>Logger: Log tool invocation
    WriteJSON->>PathValidator: validatePath("products.json", "/data")

    alt Path Valid
        PathValidator-->>WriteJSON: Resolved path: /data/products.json
        WriteJSON->>FileSystem: fs.writeFile('/data/products.json', JSON.stringify(content))
        FileSystem-->>WriteJSON: Success
        WriteJSON->>Logger: Log success
        WriteJSON-->>AgentSDK: {success: true, message: "File written"}
    else Path Invalid (traversal attempt)
        PathValidator-->>WriteJSON: Error: Path traversal detected
        WriteJSON->>Logger: Log error
        WriteJSON-->>AgentSDK: {success: false, error: "Invalid path"}
    end

    AgentSDK-->>EventLoop: Tool result + response text
    EventLoop->>SocketServer: Emit chunks
    SocketServer->>SocketClient: Stream response
    SocketClient->>ChatUI: Display: "I've created products.json with 3 items..."
    ChatUI->>User: Show confirmation
```

### Error Handling Workflow

```mermaid
sequenceDiagram
    participant User
    participant ChatUI as Chat Interface
    participant SocketClient as Socket.io Client
    participant SocketServer as Socket.io Server
    participant EventLoop as Agent Event Loop
    participant AgentSDK as Claude Agent SDK
    participant ReadJSON as read_json Tool
    participant Logger as Logger

    User->>ChatUI: "Show me the products"
    ChatUI->>SocketClient: emit('user_message')
    SocketClient->>SocketServer: Forward message
    SocketServer->>EventLoop: handleUserMessage()
    EventLoop->>AgentSDK: processMessage()

    AgentSDK->>ReadJSON: invoke({filepath: "products.json"})
    ReadJSON->>ReadJSON: Attempt to read /data/products.json

    alt File Not Found
        ReadJSON->>ReadJSON: fs.readFile throws ENOENT
        ReadJSON->>Logger: Log error (file not found)
        ReadJSON-->>AgentSDK: {success: false, error: "File not found: products.json"}
        AgentSDK-->>EventLoop: Continues with error context
        EventLoop->>SocketServer: Emit response chunks
        SocketServer->>SocketClient: Stream response
        SocketClient->>ChatUI: Display: "The products.json file doesn't exist yet..."
    else Agent SDK Error
        AgentSDK->>AgentSDK: Network error / rate limit
        AgentSDK-->>EventLoop: Throws error
        EventLoop->>Logger: Log critical error
        EventLoop->>SocketServer: emit('error', {message, code})
        SocketServer->>SocketClient: Forward error
        SocketClient->>ChatUI: Display error message
        ChatUI->>User: Show error banner
    end
```

### WebSocket Reconnection Workflow

```mermaid
sequenceDiagram
    participant User
    participant ChatUI as Chat Interface
    participant SocketClient as Socket.io Client
    participant SocketServer as Socket.io Server

    Note over User,SocketServer: Normal Operation
    ChatUI->>SocketClient: Connected

    Note over SocketClient,SocketServer: Network Interruption
    SocketClient-xSocketServer: Connection lost
    SocketClient->>SocketClient: on('disconnect')
    SocketClient->>ChatUI: Update connection status
    ChatUI->>User: Show "Disconnected" indicator

    Note over SocketClient,SocketServer: Automatic Reconnection
    loop Reconnection Attempts
        SocketClient->>SocketServer: Attempt reconnect
        alt Reconnection Successful
            SocketServer-->>SocketClient: Connected
            SocketClient->>SocketClient: on('connect')
            SocketClient->>ChatUI: Update connection status
            ChatUI->>User: Show "Connected" indicator
        else Reconnection Failed
            SocketClient->>SocketClient: Retry after delay
        end
    end
```

### Complete Demo Sequence (Product Catalog → Landing Page)

```mermaid
sequenceDiagram
    participant User
    participant Agent as Agent (via Chat UI)
    participant WriteJSON as write_json Tool
    participant WriteFile as write_file Tool
    participant Browser as Browser (New Tab)

    Note over User,Browser: Step 1: Create Product Data
    User->>Agent: "Create a product catalog with 3 tech gadgets"
    Agent->>WriteJSON: write_json("products.json", [{...}, {...}, {...}])
    WriteJSON-->>Agent: Success
    Agent-->>User: "I've created products.json with 3 items..."

    Note over User,Browser: Step 2: Generate Product List Page
    User->>Agent: "Create a products page that displays them"
    Agent->>WriteJSON: read_json("products.json")
    WriteJSON-->>Agent: Returns product data
    Agent->>WriteFile: write_file("products.html", "<html>...")
    WriteFile-->>Agent: Success
    Agent-->>User: "I've created products.html displaying all items..."

    User->>Browser: Opens http://localhost:3000/products
    Browser->>Browser: Renders products.html
    Browser-->>User: Shows product catalog page

    Note over User,Browser: Step 3: Create Landing Page
    User->>Agent: "Create a homepage that links to products"
    Agent->>WriteFile: write_file("index.html", "<html>...")
    WriteFile-->>Agent: Success
    Agent-->>User: "I've created index.html with navigation..."

    User->>Browser: Opens http://localhost:3000/
    Browser->>Browser: Renders index.html
    Browser-->>User: Shows homepage with product link
```

---

## Database Schema

**Important:** This application uses **JSON files** stored in the `/data` directory rather than a traditional database. This section documents the file-based storage approach.

### Storage Architecture

**Storage Type:** File System (JSON Files)
**Location:** `/data` directory (relative to project root)
**Format:** JSON files with `.json` extension
**Access:** Node.js `fs/promises` API with async operations

**Rationale:**
- **Educational simplicity** - No database setup, connection strings, or migrations
- **Transparency** - Files visible in filesystem, easy to inspect and debug
- **Zero configuration** - Works immediately on any Node.js environment
- **Version control friendly** - JSON files can be committed to git for demo data
- **Sufficient for MVP** - Demo data volumes (< 100 items) don't require database performance

### File Structure Examples

Since this is a **domain-agnostic framework**, the schema is defined by user conversation, not predetermined. Below are examples from the demo sequence:

**Example 1: Product Catalog (`/data/products.json`)**

```json
[
  {
    "id": "prod_001",
    "name": "Wireless Headphones",
    "price": 79.99,
    "description": "Premium noise-cancelling headphones",
    "category": "Audio",
    "inStock": true,
    "imageUrl": "/images/headphones.jpg"
  },
  {
    "id": "prod_002",
    "name": "Mechanical Keyboard",
    "price": 129.99,
    "description": "RGB backlit gaming keyboard",
    "category": "Peripherals",
    "inStock": true,
    "imageUrl": "/images/keyboard.jpg"
  },
  {
    "id": "prod_003",
    "name": "4K Webcam",
    "price": 199.99,
    "description": "Ultra HD webcam for streaming",
    "category": "Video",
    "inStock": false,
    "imageUrl": "/images/webcam.jpg"
  }
]
```

**Example 2: Blog Posts (`/data/blog-posts.json`)**

```json
[
  {
    "id": "post_001",
    "title": "Getting Started with Claude Agent SDK",
    "slug": "getting-started-claude-sdk",
    "content": "Full blog post content here...",
    "excerpt": "Learn how to build self-editing applications...",
    "author": "David Cruwys",
    "publishedAt": "2025-11-14T10:00:00Z",
    "tags": ["AI", "Agent SDK", "Tutorial"],
    "featured": true
  }
]
```

**Example 3: Application Config (`/data/config.json`)**

```json
{
  "siteName": "My Generated App",
  "theme": {
    "primaryColor": "#3b82f6",
    "fontFamily": "Inter, sans-serif"
  },
  "navigation": [
    {"label": "Home", "href": "/"},
    {"label": "Products", "href": "/products"},
    {"label": "Blog", "href": "/blog"}
  ],
  "socialLinks": {
    "twitter": "https://twitter.com/example",
    "github": "https://github.com/example"
  }
}
```

### File Organization Conventions

**Directory Structure:**

```
/data/
├── products.json           # Product catalog (if created via conversation)
├── blog-posts.json         # Blog posts (if created)
├── config.json             # Application config (if created)
├── users.json              # User data (example, not in MVP)
└── [any-filename].json     # User-defined schemas
```

**Conventions:**
- **Kebab-case filenames** - `blog-posts.json`, not `BlogPosts.json`
- **Array for collections** - `[{...}, {...}]` for lists of items
- **Object for singletons** - `{...}` for config files
- **UUID or string IDs** - `"id": "prod_001"` for item identification
- **ISO 8601 timestamps** - `"2025-11-14T10:00:00Z"` for dates

### No Schema Validation (By Design)

**Important Design Decision:** The framework does **NOT** enforce schemas. This is intentional:

**Why No Validation:**
- **Maximum flexibility** - Agent can create any JSON structure through conversation
- **Educational focus** - Demonstrates tool design, not data modeling
- **User-driven schemas** - Structure emerges from conversation, not predefined
- **Minimal code** - Validation adds complexity beyond 200 LOC target

**Trade-offs:**
- ⚠️ **Risk of invalid data** - Agent could create malformed JSON (mitigated by Claude's structured output capabilities)
- ⚠️ **No referential integrity** - No foreign key enforcement between files
- ⚠️ **No type safety at runtime** - TypeScript types exist but not enforced on file contents

**Future Enhancement (Post-MVP):**
- Add optional JSON Schema validation via tool parameter
- Implement schema registry in `/data/schemas/`
- Create validation tool: `validate_json(filepath, schemaPath)`

### Indexing and Performance

**MVP Approach:** No indexing (simple array iteration in generated HTML/JS)

**Performance Characteristics:**
- **Read operations** - O(n) file read + JSON parse (acceptable for < 100 items)
- **Write operations** - O(n) full file rewrite (no partial updates)
- **Search** - O(n) linear scan in generated JavaScript (client-side filtering)

**Future Optimization (If Needed):**
- Migrate to SQLite for larger datasets (100+ items)
- Add indexing for common queries (by ID, by category, etc.)
- Implement incremental writes (append-only logs, compaction)

### Backup and Version Control

**MVP Approach:**
- **No automatic backups** - User responsible for data safety
- **Git-friendly** - JSON files can be committed for demo data versioning
- **Manual backup** - User can copy `/data` folder

**Security Warning:**
⚠️ **Educational demo only** - Not production-ready. No data validation, authentication, or encryption.

---

## Frontend Architecture

This section defines frontend-specific architecture details for the React chat interface.

### Component Architecture

#### Component Organization

```
packages/client/src/
├── components/
│   ├── chat/
│   │   ├── ChatInterface.tsx       # Main chat container
│   │   ├── MessageList.tsx         # Scrollable message display
│   │   ├── MessageItem.tsx         # Individual message bubble
│   │   ├── MessageInput.tsx        # Text input + send button
│   │   └── TypingIndicator.tsx    # Loading dots during streaming
│   ├── ui/
│   │   ├── Button.tsx              # shadcn/ui button
│   │   ├── Input.tsx               # shadcn/ui input
│   │   ├── ScrollArea.tsx          # shadcn/ui scroll area
│   │   ├── Card.tsx                # shadcn/ui card
│   │   └── ThemeToggle.tsx         # Light/dark mode switch
│   └── layout/
│       └── AppLayout.tsx           # Root layout wrapper
├── hooks/
│   ├── useSocket.ts                # Socket.io connection hook
│   ├── useChat.ts                  # Chat state management hook
│   └── useTheme.ts                 # Theme persistence hook
├── lib/
│   └── utils.ts                    # Utility functions (cn helper, etc.)
├── styles/
│   └── globals.css                 # TailwindCSS directives + CSS variables
├── App.tsx                         # Root app component
└── main.tsx                        # React entry point
```

#### Component Template

**Example: ChatInterface Component**

```typescript
import React, { useState, useEffect } from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { TypingIndicator } from './TypingIndicator';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useSocket } from '../../hooks/useSocket';
import { useChat } from '../../hooks/useChat';
import type { ChatMessage } from '@bmad-claude-sdk/shared';

export const ChatInterface: React.FC = () => {
  const { messages, addMessage, updateLastMessage } = useChat();
  const { sendMessage, isConnected, isStreaming } = useSocket({
    onChunk: (chunk, messageId) => {
      updateLastMessage(messageId, chunk);
    },
    onComplete: (messageId) => {
      // Finalize message
    },
    onError: (error) => {
      console.error('Socket error:', error);
    }
  });

  const handleSendMessage = (content: string) => {
    const messageId = crypto.randomUUID();
    addMessage({ id: messageId, role: 'user', content, timestamp: Date.now(), status: 'complete' });
    sendMessage(content, messageId);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex items-center justify-between p-4 border-b">
        <h1 className="text-2xl font-bold">BMAD + Claude SDK</h1>
        <ThemeToggle />
      </header>

      <MessageList messages={messages} />

      {isStreaming && <TypingIndicator />}

      <MessageInput
        onSend={handleSendMessage}
        disabled={!isConnected || isStreaming}
      />
    </div>
  );
};
```

### State Management Architecture

#### State Structure

```typescript
// packages/client/src/hooks/useChat.ts
import { useState } from 'react';
import type { ChatMessage } from '@bmad-claude-sdk/shared';

interface ChatState {
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  updateLastMessage: (messageId: string, chunk: string) => void;
  clearHistory: () => void;
}

export const useChat = (): ChatState => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const addMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  };

  const updateLastMessage = (messageId: string, chunk: string) => {
    setMessages(prev => {
      const lastMsg = prev[prev.length - 1];
      if (!lastMsg || lastMsg.role !== 'assistant') {
        // Create new assistant message
        return [...prev, {
          id: messageId,
          role: 'assistant',
          content: chunk,
          timestamp: Date.now(),
          status: 'sending'
        }];
      }
      // Append to existing assistant message
      return [...prev.slice(0, -1), {
        ...lastMsg,
        content: lastMsg.content + chunk
      }];
    });
  };

  const clearHistory = () => setMessages([]);

  return { messages, addMessage, updateLastMessage, clearHistory };
};
```

#### State Management Patterns

- **Local state with useState** - Chat messages, streaming status, connection status
- **Custom hooks for encapsulation** - `useChat`, `useSocket`, `useTheme` separate concerns
- **No global state library** - React Context sufficient for theme, no Redux/Zustand needed
- **Optimistic updates** - User message added immediately, no waiting for server confirmation
- **Immutable updates** - Spread operator patterns, no direct state mutation

### Routing Architecture

#### Route Organization

**Single Page Application (SPA)** - No client-side routing library needed for MVP

```
Routes (served by Express, not React Router):
  /chat         → React SPA (chat interface)
  /             → Generated static HTML (index.html from /public)
  /products     → Generated static HTML (products.html from /public)
  /blog         → Generated static HTML (blog.html from /public)
  /{any}        → Generated static HTML ({any}.html from /public)
```

**Rationale:**
- **No React Router** - Single chat page doesn't need client-side routing
- **Express handles routes** - Serves generated HTML pages separately from React app
- **Simpler architecture** - Fewer dependencies, clearer separation between chat UI and generated pages

#### Protected Route Pattern

**N/A for MVP** - No authentication, no protected routes

Future consideration: Add authentication and protect `/chat` route

### Frontend Services Layer

#### API Client Setup

**Socket.io Client Initialization:**

```typescript
// packages/client/src/lib/socket.ts
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

export const createSocket = (): Socket => {
  const socket = io(SOCKET_URL, {
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5
  });

  socket.on('connect', () => {
    console.log('✅ Connected to server');
  });

  socket.on('disconnect', () => {
    console.log('❌ Disconnected from server');
  });

  socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
  });

  return socket;
};
```

#### Service Example

**useSocket Hook (Service Layer):**

```typescript
// packages/client/src/hooks/useSocket.ts
import { useEffect, useState, useCallback } from 'react';
import { createSocket } from '../lib/socket';
import type { Socket } from 'socket.io-client';

interface UseSocketOptions {
  onChunk: (chunk: string, messageId: string) => void;
  onComplete: (messageId: string) => void;
  onError: (error: { message: string; code?: string }) => void;
}

export const useSocket = (options: UseSocketOptions) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    const socketInstance = createSocket();
    setSocket(socketInstance);

    socketInstance.on('connect', () => setIsConnected(true));
    socketInstance.on('disconnect', () => setIsConnected(false));

    socketInstance.on('agent_response_chunk', (data) => {
      setIsStreaming(true);
      options.onChunk(data.chunk, data.messageId);
    });

    socketInstance.on('agent_response_complete', (data) => {
      setIsStreaming(false);
      options.onComplete(data.messageId);
    });

    socketInstance.on('error', (data) => {
      setIsStreaming(false);
      options.onError(data);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const sendMessage = useCallback((content: string, messageId: string) => {
    if (!socket) return;
    socket.emit('user_message', { content, messageId });
  }, [socket]);

  return { sendMessage, isConnected, isStreaming };
};
```

---

## Backend Architecture

This section defines backend-specific architecture details for the Express server and Agent SDK integration.

### Service Architecture

This application uses a **traditional server architecture** (single Express process), not serverless.

#### Controller/Route Organization

```
packages/server/src/
├── server.ts                    # Express app entry point
├── agent/
│   ├── event-loop.ts            # Agent SDK event loop (core logic)
│   ├── system-prompt.ts         # System prompt configuration
│   └── agent-config.ts          # Agent SDK initialization
├── tools/
│   ├── read-json.ts             # read_json custom tool
│   ├── write-json.ts            # write_json custom tool
│   └── write-file.ts            # write_file custom tool
├── socket/
│   └── socket-manager.ts        # Socket.io server setup and event routing
├── utils/
│   ├── logger.ts                # Structured logging utility
│   ├── errors.ts                # Custom error classes (ToolError)
│   └── path-validator.ts        # Path sandboxing validation
└── routes/
    └── health.ts                # Health check endpoint
```

#### Controller Template

**Example: Express Server Entry Point**

```typescript
// packages/server/src/server.ts
import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { initializeSocket } from './socket/socket-manager';
import { healthRouter } from './routes/health';
import { logger } from './utils/logger';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../public')));

// CORS for Vite dev server
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// Routes
app.use('/api/health', healthRouter);

// Serve generated HTML pages
app.get('*', (req, res, next) => {
  const filePath = req.path === '/' ? '/index.html' : `${req.path}.html`;
  const fullPath = path.join(__dirname, '../../public', filePath);
  res.sendFile(fullPath, (err) => {
    if (err) {
      next(); // Fall through to 404
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.io
initializeSocket(httpServer);

// Start server
httpServer.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
  logger.info(`Chat interface: http://localhost:${PORT}/chat`);
  logger.info(`Generated pages: http://localhost:${PORT}/`);
});
```

### Database Architecture

#### Schema Design

**N/A** - Using JSON files, not SQL database. See Section 8 (Database Schema) for file-based storage details.

#### Data Access Layer

**File-Based Repository Pattern:**

```typescript
// packages/server/src/tools/read-json.ts
import fs from 'fs/promises';
import path from 'path';
import { validatePath } from '../utils/path-validator';
import { ToolError } from '../utils/errors';
import { logger } from '../utils/logger';

const DATA_DIR = path.join(process.cwd(), 'data');

export const readJson = async (filepath: string): Promise<any> => {
  try {
    // Validate and resolve path
    const fullPath = validatePath(filepath, DATA_DIR);

    logger.debug(`Reading JSON file: ${fullPath}`);

    // Read file
    const content = await fs.readFile(fullPath, 'utf-8');

    // Parse JSON
    const data = JSON.parse(content);

    logger.info(`Successfully read ${filepath}`, {
      size: content.length,
      keys: Object.keys(data).length
    });

    return { success: true, data };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new ToolError(`File not found: ${filepath}`, 'FILE_NOT_FOUND');
    }
    if (error instanceof SyntaxError) {
      throw new ToolError(`Invalid JSON in ${filepath}`, 'INVALID_JSON');
    }
    throw error;
  }
};

// Tool registration object for Agent SDK
export const readJsonTool = {
  name: 'read_json',
  description: 'Read and parse a JSON file from the /data directory. Returns the parsed JSON content.',
  parameters: {
    type: 'object',
    properties: {
      filepath: {
        type: 'string',
        description: 'Relative path to the JSON file within /data directory (e.g., "products.json")'
      }
    },
    required: ['filepath']
  },
  handler: readJson
};
```

**Path Validation Utility:**

```typescript
// packages/server/src/utils/path-validator.ts
import path from 'path';
import { ToolError } from './errors';

/**
 * Validate that a filepath is within an allowed directory
 * Prevents path traversal attacks (../, absolute paths, symlinks)
 */
export const validatePath = (filepath: string, allowedDir: string): string => {
  // Resolve to absolute path
  const resolvedPath = path.resolve(allowedDir, filepath);

  // Check if path is within allowed directory
  if (!resolvedPath.startsWith(path.resolve(allowedDir))) {
    throw new ToolError(
      `Path traversal detected: ${filepath} is outside ${allowedDir}`,
      'PATH_TRAVERSAL'
    );
  }

  return resolvedPath;
};
```

### Authentication and Authorization

#### Auth Flow

**Claude API Authentication:**

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant CLI as Claude CLI
    participant AgentSDK as Agent SDK
    participant Claude as Claude API

    Note over Dev,Claude: One-time Setup
    Dev->>CLI: claude auth login
    CLI->>Claude: OAuth flow (browser)
    Claude-->>CLI: Access token + refresh token
    CLI->>CLI: Store tokens in ~/.claude/

    Note over Dev,Claude: Runtime (Every Request)
    AgentSDK->>CLI: Load credentials from ~/.claude/
    CLI-->>AgentSDK: Access token
    AgentSDK->>Claude: API request with Bearer token
    Claude-->>AgentSDK: Response

    Note over CLI,Claude: Token Refresh (Automatic)
    alt Token Expired
        AgentSDK->>Claude: Request with expired token
        Claude-->>AgentSDK: 401 Unauthorized
        AgentSDK->>CLI: Refresh access token
        CLI->>Claude: Refresh token request
        Claude-->>CLI: New access token
        CLI->>CLI: Update ~/.claude/
        AgentSDK->>Claude: Retry with new token
    end
```

**No Application-Level Auth:**
- **Single-user localhost** - No user authentication needed for MVP
- **Claude OAuth only** - Authentication for Claude API access, not for chat interface
- **Future enhancement** - Add user auth for multi-user or deployed versions

#### Middleware/Guards

**Error Handling Middleware:**

```typescript
// packages/server/src/server.ts (error handling)
import { ToolError } from './utils/errors';

// Global error handler (Express middleware)
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Request error', {
    error: err.message,
    stack: err.stack,
    path: req.path
  });

  if (err instanceof ToolError) {
    return res.status(400).json({
      error: err.message,
      code: err.code
    });
  }

  res.status(500).json({
    error: 'Internal server error'
  });
});
```

**No Authentication Middleware for MVP:**

```typescript
// Future enhancement example:
// app.use('/chat', requireAuth);
// app.use('/api/*', requireAuth);
```

---

## Unified Project Structure

Complete monorepo structure accommodating both frontend and backend with NPM workspaces.

```plaintext
bmad-claude-sdk-app/
├── .github/
│   └── workflows/                  # Future: CI/CD workflows (not in MVP)
├── packages/
│   ├── server/                     # Backend Express + Agent SDK
│   │   ├── src/
│   │   │   ├── agent/
│   │   │   │   ├── event-loop.ts   # Agent SDK event loop (Story 2.2-2.3)
│   │   │   │   ├── system-prompt.ts # Agent system prompt config
│   │   │   │   └── agent-config.ts  # Agent SDK initialization
│   │   │   ├── tools/
│   │   │   │   ├── read-json.ts    # read_json tool (Story 2.4)
│   │   │   │   ├── write-json.ts   # write_json tool (Story 2.5)
│   │   │   │   └── write-file.ts   # write_file tool (Story 2.6)
│   │   │   ├── socket/
│   │   │   │   └── socket-manager.ts # Socket.io server (Story 1.4)
│   │   │   ├── utils/
│   │   │   │   ├── logger.ts       # Structured logging
│   │   │   │   ├── errors.ts       # Custom error classes
│   │   │   │   └── path-validator.ts # Path sandboxing
│   │   │   ├── routes/
│   │   │   │   └── health.ts       # Health check endpoint
│   │   │   └── server.ts           # Express app entry point (Story 1.2)
│   │   ├── dist/                   # Compiled TypeScript output
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── client/                     # Frontend React + Vite
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── chat/
│   │   │   │   │   ├── ChatInterface.tsx    # Main chat UI (Story 3.3)
│   │   │   │   │   ├── MessageList.tsx      # Message display
│   │   │   │   │   ├── MessageItem.tsx      # Individual message
│   │   │   │   │   ├── MessageInput.tsx     # Text input + send
│   │   │   │   │   └── TypingIndicator.tsx  # Loading indicator
│   │   │   │   ├── ui/              # shadcn/ui components (Story 3.2)
│   │   │   │   │   ├── button.tsx
│   │   │   │   │   ├── input.tsx
│   │   │   │   │   ├── scroll-area.tsx
│   │   │   │   │   ├── card.tsx
│   │   │   │   │   └── theme-toggle.tsx # Light/dark toggle (Story 3.4)
│   │   │   │   └── layout/
│   │   │   │       └── AppLayout.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useSocket.ts    # Socket.io client hook
│   │   │   │   ├── useChat.ts      # Chat state management
│   │   │   │   └── useTheme.ts     # Theme persistence
│   │   │   ├── lib/
│   │   │   │   ├── socket.ts       # Socket.io client setup
│   │   │   │   └── utils.ts        # Utility functions (cn helper)
│   │   │   ├── styles/
│   │   │   │   └── globals.css     # TailwindCSS + CSS variables
│   │   │   ├── App.tsx             # Root component
│   │   │   └── main.tsx            # React entry point
│   │   ├── public/                 # Static assets (favicon, etc.)
│   │   ├── dist/                   # Vite build output
│   │   ├── index.html              # HTML entry point
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.ts      # TailwindCSS config (Story 3.2)
│   │   ├── postcss.config.js
│   │   └── components.json         # shadcn/ui config
│   └── shared/                     # Shared TypeScript types
│       ├── src/
│       │   └── types.ts            # ChatMessage, SocketEvent, ToolCall, etc.
│       ├── package.json
│       └── tsconfig.json
├── data/                           # JSON data files (user-generated)
│   ├── .gitkeep                    # Keep empty directory in git
│   └── (products.json, blog-posts.json created via conversation)
├── public/                         # Generated HTML/CSS/JS (user-generated)
│   ├── .gitkeep
│   └── (index.html, products.html created via conversation)
├── docs/
│   ├── brief.md                    # Project Brief by Mary ✅
│   ├── prd.md                      # PRD by John ✅
│   ├── architecture.md             # This document (by Winston) 🏗️
│   └── planning/                   # Supplementary planning docs
│       ├── project-reference.md
│       ├── tech-stack.md
│       ├── video-strategy.md
│       └── demo-sequence.md
├── .gitignore                      # node_modules, dist, .env, etc.
├── package.json                    # Root workspace config (Story 1.1)
├── tsconfig.json                   # Shared TypeScript config
├── README.md                       # Setup instructions
├── .env.example                    # Environment variable template
└── LICENSE
```

---

## Development Workflow

This section defines the development setup and workflow for the fullstack application.

### Local Development Setup

#### Prerequisites

```bash
# Check Node.js version (20+ required)
node --version  # Should output v20.x.x or higher

# Check npm version (10+ recommended)
npm --version   # Should output 10.x.x or higher

# Authenticate with Claude CLI (one-time setup)
claude auth login
# Opens browser for OAuth flow, stores credentials in ~/.claude/
```

#### Initial Setup

```bash
# Clone repository
git clone <repository-url>
cd bmad-claude-sdk-app

# Install all dependencies (root + workspaces)
npm install

# Create data and public directories
mkdir -p data public

# Copy environment template
cp .env.example .env

# Build TypeScript (initial compilation)
npm run build
```

#### Development Commands

```bash
# Start all services (server + client concurrently)
npm run dev
# - Server starts on http://localhost:3000
# - Vite dev server starts on http://localhost:5173
# - Chat interface: http://localhost:5173 (dev) or http://localhost:3000/chat (prod)

# Start frontend only
npm run dev:client
# Vite dev server on http://localhost:5173

# Start backend only
npm run dev:server
# Express server on http://localhost:3000

# Build all workspaces
npm run build

# Build specific workspace
npm run build:server
npm run build:client

# Run tests (future - not in MVP)
npm test
```

### Environment Configuration

#### Required Environment Variables

```bash
# Frontend (.env in packages/client, or use Vite defaults)
VITE_SOCKET_URL=http://localhost:3000
# Socket.io server URL (defaults to localhost:3000 if not set)

# Backend (.env in packages/server)
PORT=3000
# Express server port (defaults to 3000)

DEBUG=false
# Enable debug-level logging (true/false, defaults to false)

# Shared (no environment variables needed for MVP)
# Claude authentication handled by CLI (~/.claude/ directory)
```

**`.env.example`:**

```bash
# Server Configuration
PORT=3000
DEBUG=false

# Frontend Configuration (for Vite)
VITE_SOCKET_URL=http://localhost:3000
```

---

## Deployment Architecture

**MVP Deployment Strategy:** Localhost only (no cloud deployment)

### Deployment Strategy

**Frontend Deployment:**
- **Platform:** Localhost only for MVP (served by Express in production mode)
- **Build Command:** `npm run build:client` (Vite production build)
- **Output Directory:** `packages/client/dist/`
- **CDN/Edge:** None (static files served directly by Express)

**Backend Deployment:**
- **Platform:** Localhost only for MVP (Node.js process)
- **Build Command:** `npm run build:server` (TypeScript compilation)
- **Deployment Method:** Direct Node.js execution (`node dist/server.js`)

**Production Start (Localhost):**

```bash
# Build all packages
npm run build

# Start production server (serves both API and React build)
npm run start --workspace=packages/server
```

**Future Deployment Options (Post-MVP):**
- **Railway** - Simple deployment, supports monorepos, $5/month
- **Vercel** - Serverless deployment for client, separate server needed
- **VPS** - DigitalOcean/Linode with Docker containerization
- **Fly.io** - Global edge deployment

### CI/CD Pipeline

**MVP:** No CI/CD (manual local development and testing)

**Future GitHub Actions Example:**

```yaml
# .github/workflows/ci.yaml
name: CI

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm install
      - run: npm run build
      - run: npm test  # When tests are added
```

### Environments

| Environment | Frontend URL | Backend URL | Purpose |
|-------------|-------------|-------------|---------|
| Development | http://localhost:5173 | http://localhost:3000 | Local development with HMR |
| Production (Local) | http://localhost:3000/chat | http://localhost:3000 | Production build testing locally |
| Production (Future) | https://app.example.com | https://api.example.com | Deployed environment (post-MVP) |

---

## Security and Performance

### Security Requirements

**⚠️ CRITICAL: This is an EDUCATIONAL DEMO - NOT production-ready**

**Frontend Security:**
- **CSP Headers:** None for MVP (future: strict Content-Security-Policy)
- **XSS Prevention:** React's built-in escaping (JSX auto-escapes user input)
- **Secure Storage:** localStorage for theme only (no sensitive data)

**Backend Security:**
- **Input Validation:** Path sandboxing only (validates file paths within allowed directories)
- **Rate Limiting:** None for MVP (single-user localhost assumption)
- **CORS Policy:** Allow localhost:5173 (Vite dev server) only

**Authentication Security:**
- **Token Storage:** Claude CLI manages tokens in `~/.claude/` (not in application)
- **Session Management:** None (no user sessions for MVP)
- **Password Policy:** N/A (no user authentication)

**Path Sandboxing Implementation:**

```typescript
// Only allow writes to /data and /public
const validatePath = (filepath: string, allowedDir: string): string => {
  const resolved = path.resolve(allowedDir, filepath);
  if (!resolved.startsWith(path.resolve(allowedDir))) {
    throw new ToolError('Path traversal blocked');
  }
  return resolved;
};
```

**Security Warnings in Documentation:**
- Prominent warning in README.md
- No production deployment instructions in MVP
- Clear educational-only positioning

### Performance Optimization

**Frontend Performance:**
- **Bundle Size Target:** < 500KB total (React + Socket.io client + shadcn components)
- **Loading Strategy:** Code splitting via dynamic imports (future optimization)
- **Caching Strategy:** Browser caching for static assets (Cache-Control headers)

**Backend Performance:**
- **Response Time Target:** < 5 seconds first agent response (cold start), < 2 seconds subsequent
- **Database Optimization:** N/A (file-based storage, linear O(n) acceptable for demo data)
- **Caching Strategy:** None for MVP (agent responses non-cacheable, conversational context)

**Performance Not Optimized in MVP:**
- No CDN for static assets
- No image optimization
- No lazy loading for components
- No service workers or offline support

---

## Testing Strategy

**MVP Testing Approach:** Manual testing only (no automated test framework)

### Testing Pyramid

```
        E2E Tests (Future)
       /                  \
    Integration Tests (Future)
   /                            \
Unit Tests (Future)    Unit Tests (Future)
 Frontend                  Backend
```

**MVP:** All testing manual during development

### Test Organization

**Future Test Structure:**

**Frontend Tests:**
```
packages/client/tests/
├── unit/
│   ├── hooks/
│   │   ├── useSocket.test.ts
│   │   └── useChat.test.ts
│   └── components/
│       └── ChatInterface.test.tsx
└── e2e/
    └── chat-workflow.spec.ts
```

**Backend Tests:**
```
packages/server/tests/
├── unit/
│   ├── tools/
│   │   ├── read-json.test.ts
│   │   ├── write-json.test.ts
│   │   └── write-file.test.ts
│   └── utils/
│       └── path-validator.test.ts
└── integration/
    └── agent-event-loop.test.ts
```

**E2E Tests:**
```
tests/e2e/
└── complete-demo-sequence.spec.ts
```

### Test Examples

**Frontend Component Test (Future):**

```typescript
// packages/client/tests/unit/components/ChatInterface.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatInterface } from '../../../src/components/chat/ChatInterface';

describe('ChatInterface', () => {
  it('should send user message when form submitted', () => {
    render(<ChatInterface />);

    const input = screen.getByPlaceholderText('Type a message...');
    const sendButton = screen.getByText('Send');

    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(sendButton);

    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

**Backend API Test (Future):**

```typescript
// packages/server/tests/unit/tools/read-json.test.ts
import { readJson } from '../../../src/tools/read-json';
import fs from 'fs/promises';

describe('readJson tool', () => {
  it('should read and parse valid JSON file', async () => {
    // Setup: Create test file
    await fs.writeFile('data/test.json', JSON.stringify({ foo: 'bar' }));

    // Execute
    const result = await readJson('test.json');

    // Assert
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ foo: 'bar' });

    // Cleanup
    await fs.unlink('data/test.json');
  });

  it('should throw ToolError for path traversal attempt', async () => {
    await expect(readJson('../etc/passwd')).rejects.toThrow('Path traversal');
  });
});
```

**E2E Test (Future):**

```typescript
// tests/e2e/complete-demo-sequence.spec.ts
import { test, expect } from '@playwright/test';

test('complete demo sequence: products → landing page', async ({ page }) => {
  // Navigate to chat
  await page.goto('http://localhost:3000/chat');

  // Create products
  await page.fill('input[placeholder="Type a message..."]', 'Create 3 tech products');
  await page.click('button:has-text("Send")');
  await page.waitForSelector('text=/created products.json/i');

  // Generate products page
  await page.fill('input[placeholder="Type a message..."]', 'Create products.html');
  await page.click('button:has-text("Send")');
  await page.waitForSelector('text=/created products.html/i');

  // Verify generated page
  await page.goto('http://localhost:3000/products');
  await expect(page.locator('h1')).toContainText('Products');
});
```

---

## Coding Standards

**Minimal but CRITICAL standards for AI agents to follow during development.**

### Critical Fullstack Rules

- **Type Sharing:** Always define shared types in `packages/shared/src/types.ts` and import from there - never duplicate type definitions between frontend and backend
- **Path Sandboxing:** All file operations MUST use `validatePath()` utility before accessing filesystem - never use raw `fs` calls with user-provided paths
- **Error Handling:** All tools must throw `ToolError` for domain errors with clear user-facing messages - never let generic errors reach the agent
- **Logging Pattern:** Use `logger.info/warn/error/debug` with component prefix - never use `console.log` directly (e.g., `logger.info('Message received', { messageId })`)
- **Socket Event Names:** Use exact event names from shared types (`user_message`, `agent_response_chunk`, `agent_response_complete`, `error`) - never invent new event names
- **State Immutability:** Never mutate React state directly - always use setState with new objects/arrays
- **Async/Await:** Use async/await for all asynchronous operations - never use raw Promises or callbacks
- **200 LOC Target:** Keep core framework code minimal - refactor to utilities when complexity grows beyond educational clarity

### Naming Conventions

| Element | Frontend | Backend | Example |
|---------|----------|---------|---------|
| Components | PascalCase | - | `ChatInterface.tsx`, `MessageList.tsx` |
| Hooks | camelCase with 'use' prefix | - | `useSocket.ts`, `useChat.ts` |
| Tools | camelCase | camelCase | `readJson`, `writeFile` |
| Files (general) | kebab-case | kebab-case | `event-loop.ts`, `socket-manager.ts` |
| Socket Events | snake_case | snake_case | `user_message`, `agent_response_chunk` |
| JSON Files | kebab-case | kebab-case | `products.json`, `blog-posts.json` |

---

## Error Handling Strategy

### Error Flow

```mermaid
sequenceDiagram
    participant Tool as Custom Tool
    participant AgentSDK as Agent SDK
    participant EventLoop as Event Loop
    participant Socket as Socket.io
    participant Client as Client

    Tool->>Tool: File operation fails
    Tool->>Tool: throw ToolError(message, code)
    Tool-->>AgentSDK: Error caught by SDK
    AgentSDK->>AgentSDK: Include error in context
    AgentSDK-->>EventLoop: Continue with error message
    EventLoop->>Socket: Emit response chunks
    Socket->>Client: Stream agent response
    Client->>Client: Display: "File not found, shall I create it?"

    Note over Tool,Client: Errors become conversational
```

### Error Response Format

```typescript
// Shared error interface
interface ApiError {
  error: {
    code: string;           // ERROR_CODE (TOOL_ERROR, FILE_NOT_FOUND, etc.)
    message: string;        // User-friendly message
    details?: Record<string, any>;  // Optional additional context
    timestamp: string;      // ISO 8601 timestamp
    requestId: string;      // For debugging correlation
  };
}
```

### Frontend Error Handling

```typescript
// packages/client/src/hooks/useSocket.ts (error handling)
socket.on('error', (data: { message: string; code?: string }) => {
  console.error('Socket error:', data);

  // Add error message to chat
  addMessage({
    id: crypto.randomUUID(),
    role: 'assistant',
    content: `❌ Error: ${data.message}`,
    timestamp: Date.now(),
    status: 'error'
  });
});
```

### Backend Error Handling

```typescript
// packages/server/src/utils/errors.ts
export class ToolError extends Error {
  code: string;

  constructor(message: string, code: string = 'TOOL_ERROR') {
    super(message);
    this.name = 'ToolError';
    this.code = code;
  }
}

// Usage in tools:
throw new ToolError('File not found: products.json', 'FILE_NOT_FOUND');
throw new ToolError('Path traversal detected', 'PATH_TRAVERSAL');
throw new ToolError('Invalid JSON format', 'INVALID_JSON');
```

---

## Monitoring and Observability

### Monitoring Stack

- **Frontend Monitoring:** Browser console logging (no external service)
- **Backend Monitoring:** Structured console logs with `logger.ts` utility
- **Error Tracking:** Console only (future: Sentry for production deployments)
- **Performance Monitoring:** Manual observation (future: performance.now() metrics)

### Key Metrics

**Frontend Metrics (Observed Manually):**
- Page load time (browser DevTools)
- WebSocket connection stability (console logs)
- React render performance (React DevTools)
- User interaction responsiveness (manual testing)

**Backend Metrics (Logged to Console):**
- Agent response time (logged by event loop)
- Tool execution duration (logged by each tool)
- Socket.io connection count (logged by socket manager)
- File operation success/failure rate (logged by tools)

**Logging Example:**

```typescript
// Structured logging format
logger.info('Agent response complete', {
  component: 'AgentEventLoop',
  messageId: 'msg_123',
  duration: 3542,  // milliseconds
  toolsCalled: ['read_json', 'write_file'],
  chunkCount: 15
});
```

---

## Checklist Results Report

**Status:** Architecture document complete and ready for implementation.

### Executive Summary

- **Overall Architecture Completeness**: 100% ✅
- **Technical Stack Clarity**: Complete ✅
- **Implementation Readiness**: Ready for Epic 1 Story 1.1 ✅
- **Alignment with PRD**: Fully Aligned ✅
- **Critical Gaps**: None

### Category Analysis

| Category | Status | Notes |
|----------|--------|-------|
| 1. Platform & Infrastructure | ✅ COMPLETE | Localhost deployment, NPM workspaces, clear rationale |
| 2. Technology Stack | ✅ COMPLETE | All 19 technologies specified with versions and rationale |
| 3. Data Architecture | ✅ COMPLETE | File-based storage documented, domain-agnostic design clear |
| 4. API Design | ✅ COMPLETE | Socket.io events specified, tool interfaces defined |
| 5. Component Architecture | ✅ COMPLETE | 8 major components with clear responsibilities |
| 6. Frontend Architecture | ✅ COMPLETE | React patterns, hooks, state management defined |
| 7. Backend Architecture | ✅ COMPLETE | Express setup, Agent SDK integration, tools documented |
| 8. Security & Performance | ✅ COMPLETE | Path sandboxing detailed, educational warnings prominent |
| 9. Development Workflow | ✅ COMPLETE | Setup instructions, dev commands, environment config |
| 10. Testing Strategy | ✅ COMPLETE | Manual testing for MVP, future test structure documented |

### Key Architectural Strengths

1. **Educational Clarity** - Every decision justified with rationale, trade-offs explicit
2. **200 LOC Achievable** - Minimal architecture supports line count target
3. **Incremental Build Path** - Epic 2 stories build agent loop progressively (basic → streaming → tools)
4. **Type Safety** - Shared types package prevents frontend/backend mismatches
5. **Security-First** - Path sandboxing enforced before file operations
6. **Developer Experience** - Single `npm run dev` command, HMR, auto-restart
7. **Domain-Agnostic Design** - Tools don't know about "products" or "blogs", framework evolves via conversation
8. **Comprehensive Documentation** - 18 sections covering every aspect of implementation

### Alignment with PRD Success Criteria

| PRD Requirement | Architecture Support | Status |
|-----------------|---------------------|--------|
| Builds in < 5 minutes | `npm install && npm run dev` workflow documented | ✅ |
| ≤ 250 LOC core framework | Minimal architecture, utilities separate | ✅ |
| Three domain-agnostic tools | `read_json`, `write_json`, `write_file` fully specified | ✅ |
| Socket.io streaming | Complete event specification and workflow diagrams | ✅ |
| React chat interface | Component architecture, shadcn/ui integration documented | ✅ |
| NPM workspaces monorepo | Project structure detailed, package.json examples provided | ✅ |
| Claude OAuth authentication | Authentication flow diagram, no API key management | ✅ |
| Path sandboxing | `validatePath` utility specified, security section complete | ✅ |
| Educational transparency | Logging patterns, inline comments required, component diagrams | ✅ |

### Implementation Roadmap Validation

**Epic 1: Monorepo Setup with Basic Server & Client** ✅
- Architecture provides: NPM workspaces structure, Express server setup, Socket.io event specification
- Ready to implement: Stories 1.1-1.4 have clear technical foundation

**Epic 2: Claude Agent SDK Integration** ✅
- Architecture provides: Agent event loop design, tool interfaces, path sandboxing pattern
- Ready to implement: Stories 2.1-2.6 have complete specifications

**Epic 3: React Frontend with Chat Interface** ✅
- Architecture provides: Component organization, hooks pattern, shadcn/ui integration
- Ready to implement: Stories 3.1-3.4 have frontend architecture details

### Risk Assessment

**Architectural Risks Identified:**

1. **200 LOC Target** - Risk: Framework complexity may exceed target
   - Mitigation: Minimal architecture documented, utilities extracted to separate files
   - Status: ✅ Acceptable

2. **Socket.io Complexity** - Risk: WebSocket handling adds learning curve
   - Mitigation: `useSocket` hook encapsulates complexity, well-documented
   - Status: ✅ Acceptable

3. **File-Based Storage Limitations** - Risk: Performance degrades with large datasets
   - Mitigation: Educational demo scope (< 100 items), clear scalability notes
   - Status: ✅ Acceptable

4. **No Schema Validation** - Risk: Agent could create invalid JSON
   - Mitigation: Claude's structured output reliability, future enhancement path documented
   - Status: ✅ Acceptable

5. **Security Warnings** - Risk: Users deploy to production despite warnings
   - Mitigation: Prominent security section, educational positioning clear
   - Status: ✅ Acceptable

**All risks have documented mitigations and are acceptable for MVP scope.**

### Final Decision

**✅ ARCHITECTURE APPROVED - READY FOR IMPLEMENTATION**

This architecture document provides complete technical guidance for implementing the BMAD + Claude SDK Self-Editing Application Framework. All sections are comprehensive, aligned with the PRD, and ready for development to begin with Epic 1 Story 1.1.

### Next Steps for Development Team

1. **Begin Epic 1 Story 1.1** - Initialize NPM Workspaces Monorepo
   - Reference: Section 11 (Unified Project Structure)
   - Acceptance criteria: PRD lines 275-283

2. **Set up development environment**
   - Reference: Section 12.1 (Local Development Setup)
   - Run: `claude auth login` (one-time)

3. **Create initial project structure**
   - Reference: Section 11 (complete directory tree)
   - Follow: NPM workspaces configuration examples

4. **Validate setup**
   - Run: `npm install && npm run build`
   - Verify: Zero TypeScript errors across all workspaces

5. **Proceed story-by-story through Epic 1**
   - Each story has clear acceptance criteria in PRD
   - Architecture provides technical implementation details

---

**Architecture Document Complete! 🎉**

*Created by Winston (Architect) on 2025-11-14*
