# Epic 1: Monorepo Setup with Basic Server & Client

**Epic Goal**: Establish foundational project infrastructure with NPM workspaces monorepo, basic Express TypeScript server, minimal HTML client, and Socket.io real-time communication. This epic delivers complete bidirectional communication foundation before adding Agent SDK complexity, ensuring the development environment and real-time transport layer are solid.

## Story 1.1: Initialize NPM Workspaces Monorepo

**As a** developer,
**I want** a properly configured NPM workspaces monorepo with TypeScript support,
**so that** I can develop server, client, and shared code in a unified repository with type safety.

### Acceptance Criteria

1. Root `package.json` configured with workspaces array: `["packages/*"]`
2. Three workspace packages created: `packages/server`, `packages/client`, `packages/shared`
3. TypeScript installed and configured at root level with shared `tsconfig.json`
4. Each workspace has its own `package.json` with appropriate `name` field
5. Root-level scripts include `dev` command that can run server and client concurrently (using `concurrently` or similar)
6. `.gitignore` configured to exclude `node_modules`, `dist`, `.env`, and build artifacts
7. `npm install` at root successfully installs all dependencies
8. TypeScript compilation succeeds for all workspaces with `npm run build`
9. Shared types package (`packages/shared`) includes placeholder `types.ts` file with initial interface definitions (`ChatMessage`, `SocketEvent`) exported for use by server and client

## Story 1.2: Create Express TypeScript Server

**As a** developer,
**I want** a basic Express server with TypeScript configuration,
**so that** I can serve API routes and static files for the application.

### Acceptance Criteria

1. Express 5 installed in `packages/server` workspace
2. `src/server.ts` created with basic Express app initialization
3. Server listens on port 3000 (configurable via environment variable)
4. Health check route `/api/health` returns `{ status: 'ok' }` JSON response
5. TypeScript configured with `tsconfig.json` extending root config
6. Build script compiles TypeScript to `dist/` directory
7. Development script uses `tsx` or `ts-node` with watch mode for auto-restart on file changes
8. Logging utility (`src/utils/logger.ts`) created with structured format: `[timestamp] [component] message [data]`, supporting info/warn/error/debug levels, color-coded output, and DEBUG environment variable toggle
9. Error handling utility (`src/utils/errors.ts`) created with `ToolError` class
10. Server logs startup message with port number using logger utility
11. CORS configured to allow requests from Vite dev server (localhost:5173)
12. Error handling middleware configured for JSON error responses

## Story 1.3: Create Basic HTML Client

**As a** developer,
**I want** a minimal HTML client served by the Express server,
**so that** I can verify basic client-server communication before adding Socket.io and React complexity.

### Acceptance Criteria

1. `packages/client` workspace contains basic HTML structure (`index.html`)
2. Simple form with text input and submit button for testing communication
3. Client-side JavaScript makes fetch request to `/api/health` endpoint
4. Response from server displayed on page (proving client-server communication)
5. Express server configured to serve static files from `packages/client` for initial testing (production will serve from `packages/client/dist`)
6. Route `/chat` serves the HTML client
7. Basic CSS styling applied (minimal, functional)
8. Page loads successfully in browser at `http://localhost:3000/chat`
9. Form submission triggers API call and displays result without page reload
10. Create `/public` directory at project root (will be used in Epic 2 for generated HTML pages via `write_file` tool)

## Story 1.4: Implement Socket.io for Real-Time Client-Server Communication

**As a** developer,
**I want** Socket.io configured for real-time bidirectional communication between client and server,
**so that** Epic 2 can stream agent responses without introducing new transport mechanisms.

### Acceptance Criteria

1. Socket.io installed in both `packages/server` and `packages/client`
2. Socket.io server initialized in Express app
3. Client HTML updated with Socket.io client library
4. Socket event `test_message` sends message from client to server
5. Server receives `test_message`, logs it, and emits `test_response` back to client
6. Client receives `test_response` and displays in console or on page
7. Console logging shows Socket.io connection established
8. Manual test: Type message in client, server echoes back via Socket.io (proves real-time communication)
9. Error handling for Socket disconnection with user-visible message
10. README.md documents Socket.io setup and test procedure
11. Single command `npm run dev` starts both server and client
12. Hot reload works: changing server code restarts server, changing client code rebuilds client
13. TypeScript compilation has zero errors across all workspaces

---
