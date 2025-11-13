# 007 - BMAD + Claude Agent SDK

**App-a-Day #007**: Self-Editing Application Framework

A demonstration of building self-editing web applications using the Claude Agent SDK integrated with BMAD Method v4 quality gates.

---

## 🎯 Project Overview

This project demonstrates how to build a web application that can modify its own code, data structures, and UI through conversational AI - all while maintaining BMAD quality discipline.

**Key Concept**: ONE application that edits and extends itself through conversation (not a framework that builds separate apps).

### What This Demonstrates

- **Claude Agent SDK** - Event-driven agent loop with custom tools
- **BMAD Method v4** - Quality gates and story-driven development
- **Self-Editing Capability** - Application modifies itself via conversation
- **Three Epics**: Server setup → Frontend → Demo via conversation
- **Path Sandboxing** - Security constraints (data/ and public/ only)

---

## 📁 Project Status

**Current Phase**: PRE-IMPLEMENTATION (Planning Phase)

This repository contains:
- ✅ Complete planning documentation (7 documents in `docs/planning/`)
- ✅ Claude Agent SDK implementation guide (`docs/planning/agent-event-loop/`)
- ✅ Video strategy and demo sequence
- ❌ No application code yet (will be generated using BMAD workflow)

---

## 🚀 Getting Started

**For detailed guidance**, see [CLAUDE.md](CLAUDE.md) - complete documentation for working with this codebase.

**Quick Start**:
1. Read `docs/planning/project-reference.md` - Complete specification
2. Review `docs/planning/video-strategy.md` - Epic structure and flow
3. Check `docs/planning/agent-event-loop/` - SDK implementation guide
4. Follow `action-plan.md` for BMAD workflow execution (when ready)

---

## 📚 Key Documentation

| File | Purpose |
|------|---------|
| [CLAUDE.md](CLAUDE.md) | Complete repository guide for AI assistants |
| [docs/planning/project-reference.md](docs/planning/project-reference.md) | Master specification |
| [docs/planning/video-strategy.md](docs/planning/video-strategy.md) | Video narrative with epic structure |
| [docs/planning/agent-event-loop/](docs/planning/agent-event-loop/) | SDK implementation guide (DSL) |
| [docs/planning/demo-sequence.md](docs/planning/demo-sequence.md) | Epic 3 demo flow |
| [docs/planning/system-prompt.md](docs/planning/system-prompt.md) | Agent configuration |

---

## 🎬 Video Demo Plan

**Target**: Educational video demonstrating:
1. **Epic 1**: Server setup with Claude Agent SDK
2. **Epic 2**: Frontend with text interface
3. **Epic 3**: Conversational development (the demo - leave BMAD, use text box)
4. Two paradigms: Context Engineering (BMAD) vs Vibe Coding (SDK)

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
**Dangerous for**: Production without hardening, public-facing apps, untrusted input

See [docs/planning/security-note.md](docs/planning/security-note.md) for brief overview. Detailed security analysis available in `docs/planning/future/` for future video.

---

## 🔗 Related Projects

- **BMAD Method**: [GitHub](https://github.com/appydave/BMAD-METHOD)
- **Claude Agent SDK**: [npm](https://www.npmjs.com/package/@anthropic-ai/claude-agent-sdk)
- **AppyDave App-a-Day**: [Portfolio](https://github.com/appydave-app-a-day)

---

## 📝 License

MIT License - See LICENSE file for details

---

**Status**: Planning Phase Complete | Implementation Pending BMAD Workflow Execution  
**Last Updated**: 2025-11-13
