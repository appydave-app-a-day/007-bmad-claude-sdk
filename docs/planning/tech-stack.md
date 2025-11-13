---
title: Technology Stack Reference
purpose: Complete tech stack specification for BMAD agents to generate requirements and architecture
audience: BMAD analyst/architect agents, implementation planning
when_to_read: Generating PRD, architecture documentation, story breakdown
key_sections: [Monorepo Structure, Server Stack, Client Stack, Real-time Communication, Development Tools]
status: active
---

# Technology Stack Reference

**Purpose**: High-level technology decisions and architecture patterns for BMAD agents to reference during PRD/architecture generation.

---

## Monorepo Structure

**Pattern**: NPM Workspaces (proven in Storyline App)

```
project-root/
├── package.json          # Root workspace configuration
├── client/               # React frontend workspace
├── server/               # Express backend workspace
└── shared/               # Shared TypeScript types
```

**Benefits**:
- Single `npm install` at root
- Shared TypeScript types between client/server
- Single `npm run dev` runs both server and client
- Type safety across full stack

**Key Dependencies**:
- `concurrently` - Run multiple npm scripts in parallel

**Reference**: Similar to `/Users/davidcruwys/dev/ad/storyline-app/`

---

## Server Stack

### Core Framework
- **Express 5** (TypeScript)
- **Node.js** runtime
- **TypeScript** for type safety

### Claude Integration
- **@anthropic-ai/claude-agent-sdk** - Core agent loop
- Custom tools: `read_json`, `write_json`, `write_file`
- BMAD quality gate hooks

### Real-time Communication
- **Socket.io** - Streaming responses from Claude SDK to client
- Enables real-time message updates as agent generates responses

### File Operations
- **fs-extra** - Enhanced file system operations
- **chokidar** - File watching (optional, for monitoring changes)

### Security & Performance
- **helmet** - Security headers
- **cors** - Cross-origin resource sharing
- **compression** - Response compression
- **morgan** - HTTP request logging

### Development
- **tsx** - TypeScript execution for development
- **nodemon** - Auto-restart on file changes
- **dotenv** - Environment variable management

**Server Documentation**:
- Express: https://expressjs.com/
- Socket.io: https://socket.io/docs/v4/
- Claude Agent SDK: https://docs.anthropic.com/en/docs/agents-sdk

---

## Client Stack

### Core Framework
- **React 19** (TypeScript)
- **Vite 7** - Build tool and dev server
- **React Router 7** - Client-side routing

### UI Components
- **shadcn/ui** - Base component library (Tailwind + Radix)
- **Vercel AI Elements** - Pre-built AI chat components
  - Built on top of shadcn/ui
  - Components: `<Message>`, `<Response>`, `<Thread>`, input boxes
  - Handles streaming responses visually

### State Management
- **TanStack Query (React Query)** - Server state management
- **Vercel AI SDK** - `useChat()` hook for chat state and streaming

### Styling
- **TailwindCSS 4** - Utility-first CSS
- **PostCSS** - CSS processing
- **clsx** - Conditional className utility

### Real-time Communication
- **socket.io-client** - Connect to server's Socket.io for streaming

**Client Documentation**:
- React: https://react.dev/
- Vite: https://vite.dev/
- shadcn/ui: https://ui.shadcn.com/
- Vercel AI Elements: https://github.com/vercel/ai-elements
- Vercel AI SDK: https://sdk.vercel.ai/docs
- TailwindCSS: https://tailwindcss.com/

---

## Real-time Communication Pattern

### Server → Client Streaming

**Server (Express + Socket.io + Claude SDK)**:
```
User request via HTTP POST
  ↓
Claude SDK processes with streaming
  ↓
For each message block:
  → Emit via Socket.io to client
  ↓
Client receives real-time updates
```

**Client (React + Socket.io-client + Vercel AI SDK)**:
```
User types in chat input (AI Elements component)
  ↓
Send message via HTTP POST to server
  ↓
Connect to Socket.io
  ↓
useChat() hook receives streaming updates
  ↓
AI Elements components render messages in real-time
```

**Why this pattern**:
- Claude SDK streams responses block-by-block
- Socket.io provides real-time channel
- Vercel AI SDK `useChat()` manages streaming state
- AI Elements components handle visual updates

---

## Development Tools

### Build & Compilation
- **TypeScript** - Type checking and compilation
- **Vite** - Fast HMR (Hot Module Replacement) for client
- **tsx** - Direct TypeScript execution for server

### Development Workflow
- **concurrently** - Run server and client simultaneously
- **nodemon** - Auto-restart server on changes
- **Vite HMR** - Instant client updates without refresh

### Code Quality (Optional/Future)
- **ESLint** - Linting
- **Prettier** - Code formatting

---

## Architecture Decisions

### Why NPM Workspaces?
- Proven pattern from Storyline App
- Simple monorepo without complex tooling (no Nx, Turborepo)
- Shared types between client/server
- Single development command

### Why Socket.io over SSE (Server-Sent Events)?
- Bidirectional communication (future-proof)
- Better browser compatibility
- Built-in reconnection handling
- Proven in Storyline App

### Why Vercel AI Elements over custom components?
- Pre-built chat UI with streaming support
- Built on shadcn/ui (customizable)
- Designed specifically for AI chat interfaces
- Saves development time for Epic 2

### Why Vite over Create React App?
- Faster development (instant HMR)
- Modern build tool
- Better TypeScript support
- Industry standard in 2024+

---

## File Structure (When Built)

```
project-root/
├── package.json
├── node_modules/
├── client/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   └── ai-elements/    # Vercel AI Elements
│   │   └── lib/
│   └── public/
├── server/
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/
│   │   ├── index.ts            # Express + Socket.io setup
│   │   ├── claude-sdk.ts       # Claude SDK configuration
│   │   ├── tools/              # Custom tools (read_json, write_json, write_file)
│   │   └── hooks/              # BMAD quality gates
│   └── dist/                   # Compiled output
├── shared/
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       └── types/              # Shared TypeScript types
└── data/                       # User-generated data (products.json, etc.)
    └── .gitignore
```

---

## Key Dependencies Summary

**Root**:
- `concurrently` - Development orchestration

**Server**:
- `express` - Web framework
- `socket.io` - Real-time streaming
- `@anthropic-ai/claude-agent-sdk` - AI agent loop
- `fs-extra` - File operations
- `helmet`, `cors`, `compression` - Security/performance
- `tsx`, `nodemon` - Development

**Client**:
- `react`, `react-dom` - UI framework
- `vite` - Build tool
- `react-router-dom` - Routing
- `socket.io-client` - Real-time connection
- `ai` - Vercel AI SDK (useChat hook)
- `tailwindcss` - Styling
- shadcn/ui components - Base UI (installed to codebase)
- AI Elements components - Chat UI (installed to codebase)
- `@tanstack/react-query` - Data fetching

---

## Installation Commands (Reference)

**Initial Setup**:
```bash
npm install                          # Root dependencies
npm install --workspace=server      # Server dependencies
npm install --workspace=client      # Client dependencies
```

**shadcn/ui Setup**:
```bash
cd client
npx shadcn@latest init              # Initialize shadcn/ui
```

**AI Elements Setup**:
```bash
cd client
npx shadcn@latest add ai-elements   # Add AI Elements components
```

---

## Authentication & Configuration

**Claude SDK Authentication**:
- Uses Claude CLI OAuth: `claude auth login`
- No API key required for local development
- Sets up `~/.claude/` directory with credentials

**Environment Variables** (`.env`):
```
# Server
PORT=3000
NODE_ENV=development

# Client (optional)
VITE_API_URL=http://localhost:3000
```

---

## BMAD Integration Points

### Epic 1: Monorepo Setup with Basic Server & Client
**Technologies**:
- NPM workspaces (root, server, client, shared)
- Express + TypeScript server
- Basic HTML page with text box
- Form submission → server response

**Success**: Proves communication works

### Epic 2: Claude Agent SDK Integration
**Technologies**:
- Claude Agent SDK event loop
- Custom tools (read_json, write_json, write_file)
- Socket.io for real-time streaming
- BMAD quality gate hooks

**Success**: Claude SDK responds with streaming output

### Epic 3: React Frontend with Chat Interface
**Technologies**:
- Vite + React + TypeScript
- shadcn/ui + Vercel AI Elements
- Socket.io client for streaming
- TailwindCSS styling

**Success**: Production-ready chat UI

### After BMAD: Demonstration (Not an Epic)
**Technologies** (what the app generates through conversation):
- JSON data files (via write_json)
- HTML pages (via write_file)
- User-driven feature addition

**This is "Vibe Coding"**: Using the built application, not building with BMAD

---

## Success Criteria

**Development Experience**:
- ✅ Single `npm run dev` starts everything
- ✅ Hot reload works for both client and server
- ✅ Type safety across full stack
- ✅ Real-time streaming visible in browser

**Production Build**:
- ✅ `npm run build` compiles both client and server
- ✅ `npm start` runs production server
- ✅ Static client assets served from server

**Code Quality**:
- ✅ TypeScript strict mode
- ✅ No `any` types
- ✅ Shared types prevent client/server drift

---

**References**:
- Storyline App (proven pattern): `/Users/davidcruwys/dev/ad/storyline-app/`
- Claude Agent SDK docs: See `agent-event-loop/` folder
- Vercel AI SDK: https://sdk.vercel.ai/docs
- AI Elements: https://github.com/vercel/ai-elements
