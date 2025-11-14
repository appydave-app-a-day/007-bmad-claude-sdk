# Next Steps

## For UX Expert

The PRD includes UI Design Goals section (lines 66-101) with:
- Overall UX Vision (minimal chat interface)
- Key Interaction Paradigms (conversational development, streaming responses)
- Core Screens (chat interface at `/chat`, generated pages at dynamic routes)
- Accessibility target (WCAG AA)
- Branding guidelines (minimal, clean design)
- Target platforms (desktop-first, 1024px+)

**Recommended next action**: Review UI Design Goals section and create wireframes or component breakdown for:
1. Chat interface layout (`/chat` route)
2. Message display (user vs agent distinction)
3. Input field with send button
4. Light/dark mode toggle placement
5. Loading/typing indicator

No formal UX architecture document required for this MVP - the PRD provides sufficient guidance for shadcn/ui + Vercel AI Elements implementation.

## For Architect

Please review this PRD and create the architecture document (`docs/architecture.md`) covering:

**System Architecture**:
- Monorepo structure (NPM workspaces: server, client, shared)
- Express 5 server architecture with Socket.io integration
- React 19 + Vite 7 client architecture
- Socket.io event patterns and message flow

**Agent SDK Integration**:
- Event loop architecture (incremental build: basic → streaming → tools)
- Custom tool implementations (read_json, write_json, write_file)
- Path sandboxing approach for `/data` and `/public` directories
- Error handling and logging integration

**Technical Stack Details**:
- TypeScript configuration strategy (root + workspace extends)
- Build and development scripts
- Logging utility implementation (`logger.ts`)
- Error handling utility implementation (`errors.ts`)

**Data Flow**:
- User message → Socket.io → Agent Event Loop → Agent SDK → Tools → Response streaming
- File operations (JSON in `/data`, HTML/CSS/JS in `/public`)

**Security Considerations**:
- Path traversal prevention
- Sandboxing implementation details
- OAuth authentication flow (Claude CLI)

**Development Workflow**:
- Hot reload setup (Vite HMR + tsx watch mode)
- Concurrent dev server strategy
- Environment configuration

Reference sections: Requirements (lines 27-65), Technical Assumptions (lines 102-201), and all Epic Details (lines 244-543) for complete context.
