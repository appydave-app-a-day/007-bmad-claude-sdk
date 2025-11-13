# 007 - BMAD + Claude Agent SDK

**App-a-Day #007**: Self-Editing Application Framework

A demonstration of building self-editing web applications using the Claude Agent SDK integrated with BMAD Method (v6-alpha) quality gates.

---

## 🎯 Project Overview

This project demonstrates how to build a web application that can modify its own code, data structures, and UI through conversational AI - all while maintaining BMAD quality discipline.

**Key Concept**: ONE application that edits and extends itself through conversation (not a framework that builds separate apps).

### What This Demonstrates

- **Claude Agent SDK** - Event-driven agent loop with custom tools
- **BMAD Method v6** - Quality gates and story-driven development
- **Self-Editing Capability** - Application modifies itself via conversation
- **Path Sandboxing** - Security constraints (data/ and public/ only)
- **OAuth Authentication** - Claude CLI authentication (no API key needed)

---

## 📁 Project Status

**Current Phase**: PRE-IMPLEMENTATION (Planning Phase)

This repository contains:
- ✅ Complete planning documentation (8 documents in `docs/planning/`)
- ✅ Video recording action plan
- ✅ Authentication flow research
- ✅ Claude Agent SDK capability analysis
- ❌ No application code yet (will be generated using BMAD workflow)

---

## 🚀 Getting Started

**For detailed guidance**, see [CLAUDE.md](CLAUDE.md) - complete documentation for working with this codebase.

**Quick Start**:
1. Review planning documents in `docs/planning/`
2. Follow `action-plan.md` for BMAD workflow walkthrough
3. Use BMAD Method to generate implementation artifacts

---

## 📚 Key Documentation

| File | Purpose |
|------|---------|
| [CLAUDE.md](CLAUDE.md) | Complete repository guide for AI assistants |
| [action-plan.md](action-plan.md) | Step-by-step video recording script |
| [PROBLEM-DEFINITION.md](PROBLEM-DEFINITION.md) | Authentication flow research |
| [docs/planning/project-reference.md](docs/planning/project-reference.md) | Complete project specification |
| [docs/planning/agent-sdk-capabilities.md](docs/planning/agent-sdk-capabilities.md) | SDK capability matrix |

---

## 🎬 Video Demo Plan

**Target**: ~36-minute educational video demonstrating:
1. BMAD v6-alpha workflow (Quick Flow track)
2. Building a self-editing application with Claude Agent SDK
3. Progressive feature addition through conversation
4. Quality gates enforcing BMAD discipline

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

See [docs/planning/security-considerations.md](docs/planning/security-considerations.md) for full details.

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
