# Epic 2: Claude Agent SDK Integration

**Epic Goal**: Integrate Claude Agent SDK with incrementally-built event loop, implement eight custom domain-agnostic tools (discovery, read, and write tools for both `/data` and `/public` directories), add conversation memory for multi-turn dialogues, enforce path sandboxing for security, and enable streaming for real-time agent responses. This epic delivers the core conversational development capability by building the event loop step-by-step, allowing proper testing of each capability as it's added while maintaining minimal Agent SDK implementation.

## Story 2.1: Install and Configure Claude Agent SDK

**As a** developer,
**I want** Claude Agent SDK installed and authenticated,
**so that** I can integrate agent-driven conversational capabilities into the application.

### Acceptance Criteria

1. `@anthropic-ai/claude-agent-sdk` installed in `packages/server` workspace
2. Authentication configured to use Claude CLI OAuth (no API key in code)
3. Documentation added to README: "Run `claude auth login` before starting server"
4. Agent SDK initialization code in `src/agent/agent.ts` or similar module
5. Basic system prompt configured for agent (minimal, can be enhanced later)
6. Agent responds to simple test message when invoked programmatically
7. Console logging shows agent initialization success on server startup
8. Error handling for missing authentication with clear error message
9. TypeScript types imported from SDK for type safety

## Story 2.2: Create Basic Agent Event Loop

**As a** developer,
**I want** a minimal agent event loop that handles message input and returns SDK responses,
**so that** I can test agent integration before adding streaming and tools.

### Acceptance Criteria

1. Agent event loop implemented in dedicated module (e.g., `src/agent/event-loop.ts`)
2. Event loop handles: user message → agent SDK processing → response return (synchronous, no streaming yet)
3. Integration with Socket.io: listen for `user_message` event from client
4. Agent SDK invoked with received message content
5. Agent response sent back to client via Socket.io event `agent_response` (complete message, not chunks)
6. Console logging at each stage: "Received message", "Calling Agent SDK", "Agent responded", "Sent response to client"
7. Error handling with clear messages logged to console and sent to client via Socket.io
8. Manual test: Send message from client → see console logs → receive complete agent response
9. No tools registered yet (tools added in later stories)
10. Implementation kept minimal and conceptually simple with inline comments for educational clarity

## Story 2.3: Add Response Streaming to Event Loop

**As a** developer,
**I want** agent responses streamed in real-time chunks,
**so that** users see responses appear progressively rather than waiting for complete messages.

### Acceptance Criteria

1. Modify event loop to handle Agent SDK streaming responses
2. Agent SDK streaming enabled in configuration
3. Each streamed chunk emitted via Socket.io event `agent_response_chunk`
4. Final chunk followed by Socket.io event `agent_response_complete` signaling end of stream
5. Client updated to handle `agent_response_chunk` events and append to display
6. Client updated to handle `agent_response_complete` event (stop loading indicator)
7. Console logging shows: "Streaming started", "Chunk N received", "Streaming complete"
8. Manual test: Send message → see response appear progressively in real-time
9. Error handling for streaming interruptions
10. Event loop code remains minimal with clear comments explaining streaming logic

## Story 2.4: Implement Custom Tool: read_json

**As a** developer,
**I want** a custom `read_json` tool that reads JSON files from `/data` directory,
**so that** the agent can access data files through conversation.

### Acceptance Criteria

1. Custom tool `read_json` implemented with parameter: `filepath` (string)
2. Tool reads file from `/data/{filepath}` using Node.js `fs/promises`
3. Returns parsed JSON content to agent
4. Path sandboxing enforced: only files within `/data` directory accessible
5. Error handling for file not found, invalid JSON, and path traversal attempts
6. Tool registered with Agent SDK in agent configuration
7. Tool description clearly explains purpose and parameters for agent understanding
8. Console logging shows tool execution (filepath being read)
9. Manual test via event loop: Ask agent to read a test JSON file via conversation, verify response streams back correctly with file contents
10. Tool parameters and return types use TypeScript interfaces from `packages/shared` for type safety across agent and client communication

## Story 2.5: Implement Custom Tool: write_json

**As a** developer,
**I want** a custom `write_json` tool for creating/updating JSON files,
**so that** the agent can persist data through conversation.

### Acceptance Criteria

1. Custom tool `write_json` implemented with parameters: `filepath` (string), `content` (object)
2. Tool writes/updates JSON file in `/data/{filepath}`, creating directories if needed
3. Path sandboxing enforced: only `/data` directory writable for `write_json`
4. Tool registered with Agent SDK
5. Tool description clearly explains purpose, parameters, and path restrictions
6. Error handling for invalid paths, permission errors, and path traversal attempts
7. Console logging shows tool execution (filepath being written, content summary)
8. Manual test via event loop: Ask agent to create/update JSON file, verify file created, verify response streams back confirming action
9. TypeScript types ensure type safety for parameters
10. Tool parameters and return types use TypeScript interfaces from `packages/shared` for type safety across agent and client communication

## Story 2.6: Implement Custom Tool: write_file

**As a** developer,
**I want** a custom `write_file` tool for creating/updating HTML/CSS/JS files,
**so that** the agent can generate UI components through conversation.

### Acceptance Criteria

1. Custom tool `write_file` implemented with parameters: `filepath` (string), `content` (string)
2. Tool writes/updates file in `/public/{filepath}`, creating directories if needed
3. Path sandboxing enforced: only `/public` directory writable for `write_file`
4. Tool registered with Agent SDK
5. Tool description clearly explains purpose, parameters, and path restrictions
6. Error handling for invalid paths, permission errors, and path traversal attempts
7. Console logging shows tool execution (filepath being written, content length)
8. Manual test via event loop: Ask agent to create HTML file, verify file created in `/public`, verify response streams back, manually open file in browser to confirm content
9. TypeScript types ensure type safety for parameters
10. Tool parameters and return types use TypeScript interfaces from `packages/shared` for type safety across agent and client communication

## Story 2.7: Add Conversation Memory to Event Loop

**As a** user,
**I want** the agent to remember previous messages in our conversation,
**so that** I can have multi-turn dialogues without repeating context.

### Acceptance Criteria

1. Conversation history array maintained per Socket.io connection (session-based memory)
2. History structure: array of `{ role: 'user' | 'assistant', content: string }` messages
3. Each user message appended to conversation history before calling agent
4. Each complete agent response appended to conversation history after streaming finishes
5. Agent SDK `query()` call receives conversation history via options parameter
6. Console logging shows: "Conversation history: N messages" before each agent call
7. Manual test: Multi-turn conversation works (Message 1: "Add a product", Message 2: "Sugar for 50 cents" → agent understands "Sugar" is the product from Message 1)
8. Session isolation: Each Socket.io connection has independent conversation history
9. Memory cleared on socket disconnect to prevent memory leaks
10. TypeScript interface for conversation message structure in `packages/shared/src/types.ts`
