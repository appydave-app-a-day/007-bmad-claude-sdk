# 007 - BMAD + Claude Agent SDK

**App-a-Day #007**: Build Apps by Talking to Them

---

## 🎯 What You'll See

**Imagine this**: You open a web page with just a text box. You type:

> "Create 3 products for me"

The application builds a product catalog. You type:

> "Show me a product listing page"

It generates the HTML page. You type:

> "Add a homepage"

It creates one. **All through conversation. No coding.**

---

## 💡 The Magic

This is a **self-editing application** - ONE app that modifies itself based on what you tell it.

**The Human Experience:**
- Type what you want in plain English
- Watch the app build features for itself
- See data structures appear
- See pages generate in real-time
- No waiting for developers

**The Technical Reality:**
- Built with BMAD Method for quality discipline
- Powered by Claude Agent SDK for conversational AI
- Uses custom tools (read_json, write_json, write_file)
- Sandboxed for safety (only touches /data and /public)
- Streams responses in real-time via Socket.io

**Two paradigms in one project:**
1. **Context Engineering** (BMAD) - Build the foundation with discipline
2. **Vibe Coding** (SDK) - Use it conversationally to add features

---

## 📁 Project Status

**Current Phase**: PRE-IMPLEMENTATION (Planning Phase)

This repository contains:
- ✅ Complete planning documentation in `docs/planning/`
- ✅ Claude Agent SDK implementation guide (`docs/planning/agent-event-loop/`)
- ✅ Technology stack reference (`docs/planning/tech-stack.md`)
- ✅ BMAD execution guide with pre-answered questions (`docs/planning/bmad-execution-guide.md`)
- ✅ Video strategy and demo sequence
- ❌ No application code yet (will be generated using BMAD workflow)

---

## 🚀 Getting Started

**For detailed guidance**, see [CLAUDE.md](CLAUDE.md) - complete documentation for working with this codebase.

**Quick Start**:
1. Read `docs/planning/project-reference.md` - Complete specification
2. Review `docs/planning/video-strategy.md` - Epic structure and flow
3. Check `docs/planning/tech-stack.md` - Technology decisions
4. **Execute**: `docs/planning/bmad-execution-guide.md` - Step-by-step BMAD workflow with pre-answered questions
5. Follow `action-plan.md` for video recording workflow (optional)

---

## 📚 Key Documentation

| File | Purpose |
|------|---------|
| [CLAUDE.md](CLAUDE.md) | Complete repository guide for AI assistants |
| [docs/planning/project-reference.md](docs/planning/project-reference.md) | Master specification |
| [docs/planning/video-strategy.md](docs/planning/video-strategy.md) | Video narrative with epic structure |
| [docs/planning/tech-stack.md](docs/planning/tech-stack.md) | Technology stack reference |
| [docs/planning/bmad-execution-guide.md](docs/planning/bmad-execution-guide.md) | BMAD workflow with pre-answered questions |
| [docs/planning/agent-event-loop/](docs/planning/agent-event-loop/) | SDK implementation guide (DSL) |
| [docs/planning/demo-sequence.md](docs/planning/demo-sequence.md) | Post-BMAD demonstration flow |

---

## 🎬 Video Demo Plan

**Target**: Educational video demonstrating:
1. **Epic 1**: Monorepo Setup with Basic Server & Client (proves communication)
2. **Epic 2**: Claude Agent SDK Integration (proves SDK working with streaming)
3. **Epic 3**: React Frontend with Chat Interface (proves production UI)
4. **Demonstration**: Post-BMAD usage - conversational development via text box
5. Two paradigms: Context Engineering (BMAD) vs Vibe Coding (SDK)

---

## 🏗️ Architecture (Planned)

```
Frontend (Static HTML + JavaScript)
  ↓ HTTP POST /chat
Backend (Express + Claude Agent SDK)
  ↓ File I/O via custom tools
Data Layer (/data/*.json, /public/*.html)
```

**Three Custom Tools**:
- `read_json(filepath)` - Read JSON from /data
- `write_json(filepath, content)` - Create/update JSON in /data  
- `write_file(filepath, content)` - Create/update HTML/CSS/JS in /public

**BMAD Quality Gate**:
- Requires `ACTIVE_STORY.md` before tool execution
- Validates code quality using Claude Code agent

---

## ⚠️ Security Note

This is an **educational demonstration** of a self-modifying application.

**Safe for**: Local development, learning, internal tools with trusted users
**Requires hardening for**: Production, public-facing apps, untrusted users

See [docs/planning/security.md](docs/planning/security.md) for details.

---

## 🔗 Related Projects

- **BMAD Method v4 (stable)**: [GitHub](https://github.com/bmad-code-org/BMAD-METHOD)
- **BMAD Method v6 (alpha)**: [GitHub v6 tag](https://github.com/bmad-code-org/BMAD-METHOD/tree/v6.0.0-alpha.9)
- **Claude Agent SDK**: [npm](https://www.npmjs.com/package/@anthropic-ai/claude-agent-sdk)
- **AppyDave App-a-Day**: [Portfolio](https://github.com/appydave-app-a-day)

---

## 📝 License

MIT License - See LICENSE file for details

---

## 🔌 Socket.io Real-Time Communication

### Quick Start

```bash
# Install dependencies
npm install

# Start both server and client concurrently
npm run dev

# Open browser to test client
# http://localhost:3000/chat
```

### Test Procedure

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Open the test client**:
   - Navigate to `http://localhost:3000/chat` in your browser

3. **Verify connection**:
   - Check for green "✅ Connected" status indicator
   - Open browser console (F12) - should see: `Connected to server with ID: [socket-id]`

4. **Test message echo**:
   - Type a message in the input field (e.g., "Hello Socket.io")
   - Click "Send via Socket.io" button
   - Verify response appears: `Server received: "Hello Socket.io"`
   - Check console for sent/received event logs

5. **Test disconnection handling**:
   - Stop server (Ctrl+C in terminal)
   - Verify red "❌ Disconnected" status appears
   - Verify error message: "Connection lost. Please check if server is running."
   - Restart server: `npm run dev`
   - Verify auto-reconnection (green "✅ Connected" status returns)

### Socket Events

**Test Events (Story 1.4)**:

**Client → Server**:
```javascript
socket.emit('test_message', {
  message: string  // User input from form
});
```

**Server → Client**:
```javascript
socket.emit('test_response', {
  message: string,   // Echoed message from server
  timestamp: number  // Server timestamp (milliseconds)
});
```

**Connection Events**:
- `connect` - Socket.io connection established
- `disconnect` - Socket.io connection lost (automatic reconnection)

### Connection/Disconnection Behavior

**Connection**:
- Socket.io automatically establishes WebSocket connection on page load
- Green status indicator: "✅ Connected"
- Console log: `Connected to server with ID: [unique-socket-id]`

**Disconnection**:
- Triggered by server shutdown or network interruption
- Red status indicator: "❌ Disconnected - Waiting for server..."
- Response area shows error message with red background
- Console log: `Disconnected from server at [ISO timestamp]`

**Reconnection** (Automatic):
- Socket.io automatically attempts reconnection
- Connection restored when server becomes available
- Status indicator returns to green
- Response area styling resets to normal

### Troubleshooting

**Port 3000 Already in Use**:
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 [PID]
```

**Socket.io Client Not Connecting**:
1. Verify server is running: Check terminal for `Server started on port 3000`
2. Verify correct URL: Client should use `http://localhost:3000` (not https)
3. Check browser network tab (F12 → Network) for WebSocket upgrade request

**Disconnection Message Doesn't Appear**:
1. Check browser console for `disconnect` event firing
2. Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+F5)

**Hot Reload Not Working**:
- **Server**: Verify `tsx --watch` is running (automatic with `npm run dev:server`)
- **Client**: Manual browser refresh required (F5 or Cmd+R) - Vite HMR in Epic 3

---

**Status**: Epic 1 Complete (Socket.io Real-Time Communication) | Epic 2 Next (Claude Agent SDK Integration)
**Last Updated**: 2025-11-14
