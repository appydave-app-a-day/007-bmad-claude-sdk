# Coding Standards

**Minimal but CRITICAL standards for AI agents to follow during development.**

## Critical Fullstack Rules

- **Type Sharing:** Always define shared types in `packages/shared/src/types.ts` and import from there - never duplicate type definitions between frontend and backend
- **Path Sandboxing:** All file operations MUST use `validatePath()` utility before accessing filesystem - never use raw `fs` calls with user-provided paths
- **Error Handling:** All tools must throw `ToolError` for domain errors with clear user-facing messages - never let generic errors reach the agent
- **Logging Pattern:** Use `logger.info/warn/error/debug` with component prefix - never use `console.log` directly (e.g., `logger.info('Message received', { messageId })`)
- **Socket Event Names:** Use exact event names from shared types (`user_message`, `agent_response_chunk`, `agent_response_complete`, `error`) - never invent new event names
- **State Immutability:** Never mutate React state directly - always use setState with new objects/arrays
- **Async/Await:** Use async/await for all asynchronous operations - never use raw Promises or callbacks
- **200 LOC Target:** Keep core framework code minimal - refactor to utilities when complexity grows beyond educational clarity

## Naming Conventions

| Element | Frontend | Backend | Example |
|---------|----------|---------|---------|
| Components | PascalCase | - | `ChatInterface.tsx`, `MessageList.tsx` |
| Hooks | camelCase with 'use' prefix | - | `useSocket.ts`, `useChat.ts` |
| Tools | camelCase | camelCase | `readJson`, `writeFile` |
| Files (general) | kebab-case | kebab-case | `event-loop.ts`, `socket-manager.ts` |
| Socket Events | snake_case | snake_case | `user_message`, `agent_response_chunk` |
| JSON Files | kebab-case | kebab-case | `products.json`, `blog-posts.json` |

---
