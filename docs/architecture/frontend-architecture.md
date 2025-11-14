# Frontend Architecture

This section defines frontend-specific architecture details for the React chat interface.

## Component Architecture

### Component Organization

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

### Component Template

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

## State Management Architecture

### State Structure

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

### State Management Patterns

- **Local state with useState** - Chat messages, streaming status, connection status
- **Custom hooks for encapsulation** - `useChat`, `useSocket`, `useTheme` separate concerns
- **No global state library** - React Context sufficient for theme, no Redux/Zustand needed
- **Optimistic updates** - User message added immediately, no waiting for server confirmation
- **Immutable updates** - Spread operator patterns, no direct state mutation

## Routing Architecture

### Route Organization

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

### Protected Route Pattern

**N/A for MVP** - No authentication, no protected routes

Future consideration: Add authentication and protect `/chat` route

## Frontend Services Layer

### API Client Setup

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

### Service Example

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
