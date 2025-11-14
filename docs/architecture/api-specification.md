# API Specification

This application uses **Socket.io event-based communication** rather than traditional REST/GraphQL APIs. The primary interface is real-time bidirectional events between client and server.

## Socket.io Event Specification

**Connection:**

```typescript
// Client connects to Socket.io server
const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
```

**Client → Server Events:**

```typescript
// Event: user_message
// Description: User sends a chat message to the agent
// Payload:
{
  event: 'user_message',
  data: {
    content: string,      // User's message text
    messageId: string     // Client-generated UUID for tracking
  }
}

// Example:
socket.emit('user_message', {
  content: 'Create a product catalog with 3 items',
  messageId: 'msg_abc123'
});
```

**Server → Client Events:**

```typescript
// Event: agent_response_chunk
// Description: Server streams agent response in chunks (real-time)
// Payload:
{
  event: 'agent_response_chunk',
  data: {
    chunk: string,        // Text chunk from Claude Agent SDK
    messageId: string     // Matches original user message ID
  }
}

// Example:
socket.on('agent_response_chunk', (data) => {
  console.log('Chunk received:', data.chunk);
  // Append chunk to current agent message in UI
});

// Event: agent_response_complete
// Description: Agent response streaming finished
// Payload:
{
  event: 'agent_response_complete',
  data: {
    messageId: string     // Matches original user message ID
  }
}

// Example:
socket.on('agent_response_complete', (data) => {
  console.log('Response complete for message:', data.messageId);
  // Hide loading indicator, finalize message display
});

// Event: error
// Description: Server error (tool execution failure, agent error, etc.)
// Payload:
{
  event: 'error',
  data: {
    message: string,      // Human-readable error message
    code?: string,        // Optional error code (TOOL_ERROR, AGENT_ERROR, etc.)
    messageId?: string    // Associated message ID if applicable
  }
}

// Example:
socket.on('error', (data) => {
  console.error('Error:', data.message);
  // Display error to user in chat interface
});
```

## HTTP REST Endpoints (Minimal)

While Socket.io handles chat communication, the Express server provides a few HTTP endpoints:

```yaml