# Error Handling Strategy

## Error Flow

```mermaid
sequenceDiagram
    participant Tool as Custom Tool
    participant AgentSDK as Agent SDK
    participant EventLoop as Event Loop
    participant Socket as Socket.io
    participant Client as Client

    Tool->>Tool: File operation fails
    Tool->>Tool: throw ToolError(message, code)
    Tool-->>AgentSDK: Error caught by SDK
    AgentSDK->>AgentSDK: Include error in context
    AgentSDK-->>EventLoop: Continue with error message
    EventLoop->>Socket: Emit response chunks
    Socket->>Client: Stream agent response
    Client->>Client: Display: "File not found, shall I create it?"

    Note over Tool,Client: Errors become conversational
```

## Error Response Format

```typescript
// Shared error interface
interface ApiError {
  error: {
    code: string;           // ERROR_CODE (TOOL_ERROR, FILE_NOT_FOUND, etc.)
    message: string;        // User-friendly message
    details?: Record<string, any>;  // Optional additional context
    timestamp: string;      // ISO 8601 timestamp
    requestId: string;      // For debugging correlation
  };
}
```

## Frontend Error Handling

```typescript
// packages/client/src/hooks/useSocket.ts (error handling)
socket.on('error', (data: { message: string; code?: string }) => {
  console.error('Socket error:', data);

  // Add error message to chat
  addMessage({
    id: crypto.randomUUID(),
    role: 'assistant',
    content: `❌ Error: ${data.message}`,
    timestamp: Date.now(),
    status: 'error'
  });
});
```

## Backend Error Handling

```typescript
// packages/server/src/utils/errors.ts
export class ToolError extends Error {
  code: string;

  constructor(message: string, code: string = 'TOOL_ERROR') {
    super(message);
    this.name = 'ToolError';
    this.code = code;
  }
}

// Usage in tools:
throw new ToolError('File not found: products.json', 'FILE_NOT_FOUND');
throw new ToolError('Path traversal detected', 'PATH_TRAVERSAL');
throw new ToolError('Invalid JSON format', 'INVALID_JSON');
```

---
