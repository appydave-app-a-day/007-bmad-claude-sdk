# Tech Stack

This is the **DEFINITIVE** technology selection for the entire project. All development must use these exact versions.

## Technology Stack Table

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
