# Technical Assumptions

## Repository Structure: Monorepo

NPM workspaces monorepo structure (proven pattern from Storyline App):
- **Root workspace**: Shared configuration, scripts, dependencies
- **packages/server**: Express + TypeScript server with Agent SDK integration
- **packages/client**: React + Vite chat interface
- **packages/shared**: Shared TypeScript types between server and client

Single `npm run dev` command starts both server and client concurrently.

## Service Architecture

**Single Express Monolith**:
- Express 5 server handling both API routes and static file serving
- Socket.io for bidirectional real-time communication
- Claude Agent SDK runs in-process within the Express server (not separate service)
- File operations limited to `/data` (JSON files) and `/public` (HTML/CSS/JS)
- Routes:
  - `/chat` - React chat interface
  - `/` and dynamic routes (`/products`, `/blog`, etc.) - Serve generated HTML from `/public`
  - Socket.io endpoint for agent streaming

**Rationale**: No microservices complexity for educational demo - single process is easier to understand and debug.

## Testing Requirements

**Minimal Testing for MVP**:
- No formal testing framework (Jest, Playwright) in initial implementation
- Manual testing during development
- Educational focus prioritizes working demonstration over test coverage

**Future considerations**: Unit tests for custom tools, integration tests for agent event loop

## Additional Technical Assumptions and Requests

**Frontend Stack**:
- React 19 + TypeScript 5.7+
- Vite 7 for dev server and build
- shadcn/ui for base components (chat interface primitives)
- Vercel AI Elements for chat UI patterns
- TailwindCSS 4 for styling
- Socket.io-client for streaming communication

**Backend Stack**:
- Node.js 20+ (LTS)
- Express 5 + TypeScript
- Claude Agent SDK (`@anthropic-ai/claude-agent-sdk`)
- Socket.io server
- Node.js filesystem APIs (fs/promises)

**Authentication**:
- Claude CLI OAuth: `claude auth login` (no API key management)
- Uses existing Claude Pro/Team subscription
- Single-user localhost deployment (no multi-user auth)

**Data Storage**:
- JSON files in `/data` directory (no database)
- Generated HTML/CSS/JS in `/public` directory
- No external storage services

**Development Environment**:
- Local development only: `localhost:3000` (Express) + `localhost:5173` (Vite dev server)
- No deployment configuration for MVP (future: Railway, Vercel, or VPS)

**Code Quality**:
- TypeScript strict mode enabled
- ESLint + Prettier for code formatting
- Inline comments explaining Agent SDK patterns for educational value

**Logging Pattern**:
- Lightweight structured console logging utility (`logger.ts`)
- Consistent format: `[timestamp] [component] message [data]`
- Log levels: info, warn, error, debug
- Color-coded output for development clarity
- Component-based logging (e.g., "AgentEventLoop", "Tool:read_json", "Socket")
- Debug mode via `DEBUG=true` environment variable

**Error Handling Pattern**:
- Custom `ToolError` class for domain errors
- Consistent error response format across tools
- User-friendly error messages returned to agent
- Detailed errors logged to console for developer transparency

**Developer Experience**:
- Hot module reload (HMR) for React components via Vite
- Server auto-restart on TypeScript changes via tsx/ts-node watch mode
- Single `npm run dev` command starts both server and client concurrently
- Clear console output showing server/client status

**Security Constraints**:
- ⚠️ **EDUCATIONAL DEMO ONLY** - Not production-ready
- Path sandboxing: Only `/data` and `/public` writable
- No input validation beyond path checking (MVP)
- Prominent security warnings in documentation
- Single-user localhost deployment assumption

**Dependencies**:
- All stable releases (no beta/experimental packages)
- Version pinning in package.json for reproducibility
- Minimal dependency footprint where possible
