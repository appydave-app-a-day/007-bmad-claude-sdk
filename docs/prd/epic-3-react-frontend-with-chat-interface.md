# Epic 3: React Frontend with Chat Interface

**Epic Goal**: Build production-quality React chat interface using React 19, Vite 7, shadcn/ui components, and Vercel AI Elements chat patterns. Replace basic HTML client with professional chat UI featuring Socket.io client integration, light/dark mode toggle, message streaming display, and TailwindCSS styling. This epic delivers the polished user experience that makes the educational demonstration video-ready and provides a reference implementation for developers.

## Story 3.1: Initialize React + Vite Application

**As a** developer,
**I want** a React + Vite application in the client workspace,
**so that** I can build a modern, fast-loading chat interface.

### Acceptance Criteria

1. `packages/client` workspace converted to React 19 + Vite 7 project
2. TypeScript configured with React JSX support
3. Vite dev server configured to run on port 5173
4. Hot module replacement (HMR) working for React components
5. Build script compiles production-ready bundle to `dist/`
6. Express server updated to serve React build output from `/chat` route
7. Root `package.json` dev script starts both Vite dev server and Express concurrently
8. Basic React app renders "Hello World" at `http://localhost:5173`
9. Development mode uses Vite dev server, production serves compiled bundle via Express
10. No console errors or warnings in browser

## Story 3.2: Install shadcn/ui and Configure TailwindCSS

**As a** developer,
**I want** shadcn/ui components and TailwindCSS configured,
**so that** I can build a professional-looking chat interface with minimal custom CSS.

### Acceptance Criteria

1. TailwindCSS 4 installed and configured in `packages/client`
2. shadcn/ui CLI initialized with configuration
3. Base components installed: `button`, `input`, `card`, `scroll-area`
4. TailwindCSS theme configured with light and dark mode support
5. CSS variables defined for theme colors
6. `globals.css` includes Tailwind directives and base styles
7. Vite configured to process TailwindCSS
8. Test component renders using shadcn/ui button with Tailwind classes
9. Build process compiles CSS successfully
10. No style conflicts or console warnings

## Story 3.3: Build Chat Interface with Vercel AI Elements

**As a** developer,
**I want** a chat interface using Vercel AI Elements patterns,
**so that** users can send messages and see streaming agent responses in a familiar chat UI.

### Acceptance Criteria

1. Vercel AI SDK UI patterns applied (chat interface layout, message bubbles, input design) - Socket.io handles streaming, not Vercel's built-in streaming
2. Chat interface component created with message list and input field
3. Message display shows user messages and agent responses with clear visual distinction
4. Text input field with send button for user messages
5. Messages displayed in scrollable area with automatic scroll to latest message
6. Socket.io client integrated to send/receive messages
7. User message triggers `user_message` Socket event to server
8. Agent responses received via `agent_response_chunk` Socket events displayed in real-time
9. Streaming responses append chunks to current agent message (not create new messages per chunk)
10. Loading/typing indicator shown while agent is processing
11. Message history persists during session (cleared on page refresh)
12. Keyboard shortcut: Enter key sends message, Shift+Enter adds new line

## Story 3.4: Implement Light/Dark Mode Toggle

**As a** developer,
**I want** a light/dark mode toggle button,
**so that** users can choose their preferred visual theme.

### Acceptance Criteria

1. Theme toggle button added to chat interface (visible, accessible location)
2. Button icon changes based on current theme (sun/moon or similar)
3. Clicking toggle switches between light and dark mode
4. Theme preference stored in localStorage
5. Theme applied on page load based on localStorage value
6. Default theme: light mode (if no localStorage preference)
7. TailwindCSS dark mode classes applied correctly across all components
8. All text remains readable in both themes (contrast compliance)
9. Smooth transition animation when switching themes (optional but nice)
10. No flash of wrong theme on page load

---
