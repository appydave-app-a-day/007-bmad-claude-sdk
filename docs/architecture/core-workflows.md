# Core Workflows

These sequence diagrams illustrate the key system workflows showing component interactions.

## User Message → Agent Response (Happy Path)

```mermaid
sequenceDiagram
    participant User
    participant ChatUI as Chat Interface
    participant SocketClient as Socket.io Client
    participant SocketServer as Socket.io Server
    participant EventLoop as Agent Event Loop
    participant AgentSDK as Claude Agent SDK
    participant Claude as Claude API

    User->>ChatUI: Types message & clicks Send
    ChatUI->>ChatUI: Generate messageId (UUID)
    ChatUI->>ChatUI: Add user message to state
    ChatUI->>SocketClient: sendMessage(content, messageId)
    SocketClient->>SocketServer: emit('user_message', {content, messageId})

    SocketServer->>EventLoop: handleUserMessage(content, messageId)
    EventLoop->>EventLoop: Log: "Processing message"
    EventLoop->>AgentSDK: processMessage(content)
    AgentSDK->>Claude: Send message with system prompt

    loop Streaming Response
        Claude-->>AgentSDK: Response chunk
        AgentSDK-->>EventLoop: Yield chunk
        EventLoop->>SocketServer: Emit chunk
        SocketServer->>SocketClient: emit('agent_response_chunk', {chunk, messageId})
        SocketClient->>ChatUI: Update current message
        ChatUI->>User: Display chunk (progressive update)
    end

    AgentSDK-->>EventLoop: Stream complete
    EventLoop->>SocketServer: Emit complete
    SocketServer->>SocketClient: emit('agent_response_complete', {messageId})
    SocketClient->>ChatUI: Finalize message
    ChatUI->>User: Show complete message
```

## Agent Tool Invocation (write_json Example)

```mermaid
sequenceDiagram
    participant User
    participant ChatUI as Chat Interface
    participant SocketClient as Socket.io Client
    participant SocketServer as Socket.io Server
    participant EventLoop as Agent Event Loop
    participant AgentSDK as Claude Agent SDK
    participant WriteJSON as write_json Tool
    participant PathValidator as Path Validator
    participant FileSystem as File System
    participant Logger as Logger

    User->>ChatUI: "Create a product catalog with 3 items"
    ChatUI->>SocketClient: emit('user_message')
    SocketClient->>SocketServer: Forward message
    SocketServer->>EventLoop: handleUserMessage()
    EventLoop->>AgentSDK: processMessage()

    AgentSDK->>AgentSDK: Decides to use write_json tool
    AgentSDK->>WriteJSON: invoke({filepath: "products.json", content: {...}})

    WriteJSON->>Logger: Log tool invocation
    WriteJSON->>PathValidator: validatePath("products.json", "/data")

    alt Path Valid
        PathValidator-->>WriteJSON: Resolved path: /data/products.json
        WriteJSON->>FileSystem: fs.writeFile('/data/products.json', JSON.stringify(content))
        FileSystem-->>WriteJSON: Success
        WriteJSON->>Logger: Log success
        WriteJSON-->>AgentSDK: {success: true, message: "File written"}
    else Path Invalid (traversal attempt)
        PathValidator-->>WriteJSON: Error: Path traversal detected
        WriteJSON->>Logger: Log error
        WriteJSON-->>AgentSDK: {success: false, error: "Invalid path"}
    end

    AgentSDK-->>EventLoop: Tool result + response text
    EventLoop->>SocketServer: Emit chunks
    SocketServer->>SocketClient: Stream response
    SocketClient->>ChatUI: Display: "I've created products.json with 3 items..."
    ChatUI->>User: Show confirmation
```

## Error Handling Workflow

```mermaid
sequenceDiagram
    participant User
    participant ChatUI as Chat Interface
    participant SocketClient as Socket.io Client
    participant SocketServer as Socket.io Server
    participant EventLoop as Agent Event Loop
    participant AgentSDK as Claude Agent SDK
    participant ReadJSON as read_json Tool
    participant Logger as Logger

    User->>ChatUI: "Show me the products"
    ChatUI->>SocketClient: emit('user_message')
    SocketClient->>SocketServer: Forward message
    SocketServer->>EventLoop: handleUserMessage()
    EventLoop->>AgentSDK: processMessage()

    AgentSDK->>ReadJSON: invoke({filepath: "products.json"})
    ReadJSON->>ReadJSON: Attempt to read /data/products.json

    alt File Not Found
        ReadJSON->>ReadJSON: fs.readFile throws ENOENT
        ReadJSON->>Logger: Log error (file not found)
        ReadJSON-->>AgentSDK: {success: false, error: "File not found: products.json"}
        AgentSDK-->>EventLoop: Continues with error context
        EventLoop->>SocketServer: Emit response chunks
        SocketServer->>SocketClient: Stream response
        SocketClient->>ChatUI: Display: "The products.json file doesn't exist yet..."
    else Agent SDK Error
        AgentSDK->>AgentSDK: Network error / rate limit
        AgentSDK-->>EventLoop: Throws error
        EventLoop->>Logger: Log critical error
        EventLoop->>SocketServer: emit('error', {message, code})
        SocketServer->>SocketClient: Forward error
        SocketClient->>ChatUI: Display error message
        ChatUI->>User: Show error banner
    end
```

## WebSocket Reconnection Workflow

```mermaid
sequenceDiagram
    participant User
    participant ChatUI as Chat Interface
    participant SocketClient as Socket.io Client
    participant SocketServer as Socket.io Server

    Note over User,SocketServer: Normal Operation
    ChatUI->>SocketClient: Connected

    Note over SocketClient,SocketServer: Network Interruption
    SocketClient-xSocketServer: Connection lost
    SocketClient->>SocketClient: on('disconnect')
    SocketClient->>ChatUI: Update connection status
    ChatUI->>User: Show "Disconnected" indicator

    Note over SocketClient,SocketServer: Automatic Reconnection
    loop Reconnection Attempts
        SocketClient->>SocketServer: Attempt reconnect
        alt Reconnection Successful
            SocketServer-->>SocketClient: Connected
            SocketClient->>SocketClient: on('connect')
            SocketClient->>ChatUI: Update connection status
            ChatUI->>User: Show "Connected" indicator
        else Reconnection Failed
            SocketClient->>SocketClient: Retry after delay
        end
    end
```

## Complete Demo Sequence (Product Catalog → Landing Page)

```mermaid
sequenceDiagram
    participant User
    participant Agent as Agent (via Chat UI)
    participant WriteJSON as write_json Tool
    participant WriteFile as write_file Tool
    participant Browser as Browser (New Tab)

    Note over User,Browser: Step 1: Create Product Data
    User->>Agent: "Create a product catalog with 3 tech gadgets"
    Agent->>WriteJSON: write_json("products.json", [{...}, {...}, {...}])
    WriteJSON-->>Agent: Success
    Agent-->>User: "I've created products.json with 3 items..."

    Note over User,Browser: Step 2: Generate Product List Page
    User->>Agent: "Create a products page that displays them"
    Agent->>WriteJSON: read_json("products.json")
    WriteJSON-->>Agent: Returns product data
    Agent->>WriteFile: write_file("products.html", "<html>...")
    WriteFile-->>Agent: Success
    Agent-->>User: "I've created products.html displaying all items..."

    User->>Browser: Opens http://localhost:3000/products
    Browser->>Browser: Renders products.html
    Browser-->>User: Shows product catalog page

    Note over User,Browser: Step 3: Create Landing Page
    User->>Agent: "Create a homepage that links to products"
    Agent->>WriteFile: write_file("index.html", "<html>...")
    WriteFile-->>Agent: Success
    Agent-->>User: "I've created index.html with navigation..."

    User->>Browser: Opens http://localhost:3000/
    Browser->>Browser: Renders index.html
    Browser-->>User: Shows homepage with product link
```

---
