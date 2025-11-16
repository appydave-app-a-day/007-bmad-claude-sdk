# Data Models

Since this is a **meta-framework** with domain-agnostic tools, the core data models focus on the **framework itself** rather than application-specific entities (like products or blogs). The framework provides the structure for the agent to create arbitrary data models through conversation.

## Framework Message Model

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
- Part of server-side conversation memory (Story 2.7) - session-scoped history
- No persistence (MVP) - conversation history lost on page refresh or socket disconnect

## Conversation History Model

**Purpose:** Represents the server-side conversation memory maintained per Socket.io connection (Story 2.7).

**Key Attributes:**
- `socketId`: string - Socket.io connection ID (used as session key)
- `messages`: array - Ordered list of conversation messages
- `createdAt`: number - When conversation started
- `lastActivityAt`: number - Last message timestamp

**TypeScript Interface:**

```typescript
interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ConversationHistory {
  socketId: string;
  messages: ConversationMessage[];
  createdAt: number;
  lastActivityAt: number;
}
```

**Storage:**
- In-memory Map: `Map<socketId, ConversationHistory>`
- Cleared on socket disconnect to prevent memory leaks
- No persistence (MVP) - lost on server restart

**Usage:**
- Maintained by Agent Event Loop
- Passed to Agent SDK `query()` options for multi-turn conversations
- Enables context retention: "Add a product" → "Sugar for 50 cents" (agent remembers first message)

**Relationships:**
- Tied to Socket.io connection lifecycle
- Used by `handleUserMessage()` in event-loop.ts
- Synced with client-side ChatHistory (client maintains UI state, server maintains agent context)

## Agent Tool Call Model

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

## Socket Event Model

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

## Application Data Models (User-Generated)

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
