# Unified Project Structure

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
