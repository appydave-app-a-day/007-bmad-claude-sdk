---
title: Project Reference
purpose: Master specification for BMAD + Claude SDK self-editing application
audience: BMAD analyst/architect agents, implementation agents
when_to_read: Starting BMAD workflow, creating PRD/architecture, need complete project vision
key_sections: [Project Overview, Epic Structure, Architecture, System Prompt, Implementation Code, Success Metrics]
status: active
---

# BMAD + Claude Agent SDK: Self-Editing Application Framework

---

## ⚠️ SECURITY WARNING

**This is educational demo code, NOT production-ready.**

Self-modifying applications that accept user input are inherently risky. This demo is appropriate for:
- ✅ Local development and learning
- ✅ Internal tools with trusted users
- ✅ Rapid MVPs and prototyping

**NOT appropriate for**:
- ❌ Public-facing production systems
- ❌ Applications with untrusted users
- ❌ Systems handling sensitive data

**See**: `security-considerations.md` for full attack vectors and hardening requirements.

---

## Project Overview

Build a self-editing web application that modifies itself through conversational AI:

1. **Claude Agent SDK** integration with custom file/data tools
2. **BMAD Method v4** workflow as quality gates and guardrails
3. **Self-editing software** - an application that evolves and adds features to itself via conversation

### What We're Building (Requirements)
- **Monorepo**: NPM workspaces (root, server, client, shared)
- **Backend**: Express + TypeScript server with Claude Agent SDK
- **Frontend**: React + Vite + shadcn/ui chat interface
- **Streaming**: Socket.io for real-time communication
- **Tools**: 3 custom tools (read_json, write_json, write_file)
- **Hooks**: BMAD quality gates (active story requirement)

### What the Application Builds for Itself (Through Conversation)
- Data structures (products.json, blog.json, etc.)
- List and detail pages (HTML)
- Landing page with featured content
- New endpoints and features
- Updates to existing functionality

**Key Insight**: We're NOT coding the product catalog or blog features. We're coding the self-editing application that modifies itself to add these features through conversation.

### Target: 100-200 lines of core framework code

---

## Epic Structure (BMAD Development)

### Epic 1: Monorepo Setup with Basic Server & Client

**Using**: BMAD Method v4 + Claude Code

**Goal**: Full-stack foundation with basic communication
- NPM workspaces (root, server, client, shared)
- Express + TypeScript server
- Basic HTML page with text box (client)
- Submit form → hits server → returns response

**Success**: Type in text box, see server response (proves communication works)

**BMAD artifacts**: PRD, Architecture, Stories, ACTIVE_STORY

---

### Epic 2: Claude Agent SDK Integration

**Using**: BMAD Method v4 + Claude Code

**Goal**: Add Claude SDK to server with streaming
- Claude Agent SDK event loop
- Custom tools (read_json, write_json, write_file)
- BMAD quality gate hooks
- Socket.io for real-time streaming
- Text box → SDK → response printed on page

**Success**: Type message, Claude SDK responds, see streaming output

**BMAD artifacts**: Stories continue, quality gates maintained

---

### Epic 3: React Frontend with Chat Interface

**Using**: BMAD Method v4 + Claude Code

**Goal**: Replace basic HTML with production-ready chat UI
- Vite + React + TypeScript
- shadcn/ui + Vercel AI Elements
- Socket.io client for streaming
- Professional chat interface

**Success**: Beautiful chat UI with streaming responses

**BMAD artifacts**: Stories continue, quality gates maintained

---

## After BMAD: The Demonstration (Not an Epic)

**THE PIVOT**: BMAD is done. Now USE the application.

**What happens**: Leave Claude Code, open browser, use the text box
- Create data structures conversationally (products.json)
- Generate UI pages (listing, detail, homepage)
- Application modifies itself through conversation
- Progressive feature addition

**This is "Vibe Coding"**:
- No BMAD stories, no quality gates
- Just conversational requests → self-editing application responds
- Shows the power of what we built WITH BMAD

**See**: `demo-sequence.md` for detailed step-by-step flow

---

## Technology Stack

**See `tech-stack.md` for complete technology reference.**

### Monorepo Structure
- **NPM Workspaces** - Proven pattern from Storyline App
- **Structure**: root, server, client, shared workspaces
- **Benefits**: Shared TypeScript types, single dev command

### Server Stack
- **Express 5** + TypeScript
- **Claude Agent SDK** - Event-driven agent loop
- **Socket.io** - Real-time streaming to client
- **Custom tools**: read_json, write_json, write_file
- **BMAD hooks**: Quality gate enforcement

### Client Stack
- **React 19** + TypeScript
- **Vite 7** - Build tool and dev server
- **shadcn/ui** - Base component library
- **Vercel AI Elements** - Pre-built AI chat components
- **Socket.io-client** - Streaming connection
- **TailwindCSS 4** - Styling

### Why This Stack?
- Proven in Storyline App (NPM workspaces pattern)
- Type safety across full stack (shared types)
- Modern tooling (Vite, React 19)
- Real-time streaming built-in (Socket.io)
- Production-ready chat UI (Vercel AI Elements)

---

## Architecture

### Three-Layer System

```
┌─────────────────────────────────────────┐
│  Frontend (React + Vite)                │
│  - Chat interface (Vercel AI Elements)  │
│  - Real-time streaming display          │
│  - Socket.io client connection          │
└─────────────────────────────────────────┘
                  ↓ Socket.io
┌─────────────────────────────────────────┐
│  Backend (Express + Agent SDK)          │
│  - POST /chat endpoint                  │
│  - Socket.io server (streaming)         │
│  - Claude Agent with custom tools       │
│  - Static client asset serving          │
└─────────────────────────────────────────┘
                  ↓ File I/O
┌─────────────────────────────────────────┐
│  Data Layer                             │
│  - /data/*.json (generated data)        │
│  - /public/*.html (generated pages)     │
└─────────────────────────────────────────┘
```

### Technical Decisions

**Streaming**: Real-time via Socket.io
- Claude SDK streams responses block-by-block
- Socket.io sends updates to client in real-time
- Vercel AI Elements handle visual streaming
- Better UX, shows agent "thinking"

**Custom Tools** (not built-in Claude Code tools):
- More explicit, domain-specific
- Clearer sandbox boundaries (`/public` and `/data` only)
- Easier to explain in demo

**Permission Mode**: Auto-accept (`accept_edits`)
- Appropriate for sandboxed demo environment
- No manual confirmations needed

**No MCP** (Model Context Protocol):
- Not needed for focused demo
- Custom tools sufficient for our use case

**Authentication**: Claude CLI OAuth (`claude auth login`)
- No API key required
- No API credits consumed
- Uses Claude desktop session

---

## Core Framework Features (What We Code)

### Agent Tools (3 custom tools)

1. **read_json(filepath)** - Read any JSON file from `/data` directory
2. **write_json(filepath, content)** - Create or update any JSON file in `/data`
3. **write_file(filepath, content)** - Create or update any HTML/CSS/JS file in `/public`

These tools are **generic** - they don't know about "products" or "blogs". The application evolves based on conversation.

### System Prompt (Self-Editing Capabilities)

**See**: `system-prompt.md` for current prompt and evolution tracking.

**Key elements**:
- Identity: "careful site generator"
- Tools: read_json, write_json, write_file
- Constraints: Tailwind, sandbox to /public and /data
- Output: Friendly summaries
- Context: "ONE evolving application, not separate apps"

The prompt emphasizes self-modification and evolution, not specific domains.

---

## Use Case Example: Product Catalog

*This is what we'll DEMO, not what we'll CODE:*

### Example Data Model (Agent Creates This)

```json
{
  "id": "sku_001",
  "name": "Orbit Mug",
  "slug": "orbit-mug",
  "price": 19.99,
  "category": "kitchen",
  "pinned": false,
  "description": "A beautiful ceramic mug",
  "attrs": {
    "material": "ceramic",
    "capacity_ml": 350,
    "color": "white"
  }
}
```

This structure is determined by the conversation, not hardcoded.

---

## Demo Workflow (Video Storyline)

### Phase 1: Concept & Planning (BMAD in Claude Code/VSCode)
**Goal:** Define what we're building - a self-building app framework

**Activities:**
- Discuss the concept: "A framework that builds apps via conversation"
- Use BMAD Analyst agent to create requirements document
- Generate PRD → Epics → Stories → Architecture
- Define the meta-application (not the product catalog)

**BMAD Artifacts Created:**
- `bmad/bmm/docs/prd.md` - Framework requirements
- `bmad/bmm/stories/` - Implementation stories
- `bmad/bmm/docs/architecture.md` - System design

---

### Phase 2: Build the Framework (BMAD Development Phase)
**Goal:** Code the 200-line framework that enables conversation-driven development

**4.1 Server Setup**
- Express server with Claude Agent SDK integration
- Three generic tools: read_json, write_json, write_file
- BMAD quality gate hooks
- Chat endpoint with SSE streaming

**4.2 Client Setup**
- Single HTML page with text box
- Tailwind styling
- Basic nav structure (empty, ready for content)
- Placeholder links: Products, Blog, etc. (not implemented yet)

**BMAD Consideration:**
*At this point, we could show how BMAD development agents built the framework - reviewing stories, running tests, checking architecture alignment. This demonstrates "BMAD building BMAD-aware tools."*

---

### Phase 3: Switch Contexts - Now Use the Framework (In Browser Text Box)
**The Pivot:** We leave VSCode/Claude Code. Everything from here happens in the browser text box.

**5. Products Example**

**5.1 Create Product Data**
```
User → Text box: "Create 3 simple products with id, name, price, category"
Agent → Creates data/products.json
```

**5.2 Product List Page**
```
User → Text box: "Generate a product listing page using that data"
Agent → Creates public/products.html (grid, links to details)
```

**5.3 Product Detail Page**
```
User → Text box: "Create product detail page template"
Agent → Creates public/product-detail.html (or dynamic routing)
```

**5.4 Enrich Data**
```
User → Text box: "Add metadata: material, capacity, color to products"
Agent → Updates products.json
User → Text box: "Update listing to show new attributes"
Agent → Regenerates products.html with richer display
User → Text box: "Update the PRD to reflect this feature expansion"
Agent → Updates bmad/bmm/docs/prd.md with new product attributes
```

*BMAD Consideration: Demonstrates how the application can maintain its own documentation as it evolves. The agent updates the PRD to reflect new features added through conversation.*

---

**6. Landing Page with Featured Products**
```
User → Text box: "Create landing page featuring 3 pinned products"
Agent → Creates/updates public/index.html with hero + featured grid
```

*BMAD Consideration: At this point, use Claude Code agent to validate code quality. Have the agent review the generated HTML/data for:*
- *Code quality and consistency*
- *Whether anything has gone off the rails*
- *Adherence to the PRD requirements*
- *Acceptance criteria validation against the active story*

*This demonstrates BMAD quality gates even in self-editing mode.*

**Optional Enhancement:**
```
User → Text box: "When I add new features, automatically update the PRD"
Agent → Updates system prompt to include PRD auto-update instruction
```

*This sets up automatic documentation maintenance for the next feature (blog).*

---

**7. Blog Example**

**7.1 Blog Data & Pages**
```
User → Text box: "Create blog system: 5 posts with title, date, author, content"
Agent → Creates data/blog.json
Agent → Automatically updates bmad/bmm/docs/prd.md (if auto-update was enabled)

User → Text box: "Generate blog list and detail pages"
Agent → Creates public/blog.html, public/blog-detail.html
Agent → Automatically updates PRD with blog feature documentation
```

*BMAD Consideration: If PRD auto-update was enabled in step 6, the agent now automatically maintains documentation as it adds features. This demonstrates the application becoming self-documenting.*

*Optional: The agent could also create its own story file for this feature, showing full BMAD self-management.*

---

**8. Update Landing Page**
```
User → Text box: "Update landing to include latest 2 blog posts below products"
Agent → Refactors index.html to pull from both products.json and blog.json
Agent → Automatically updates PRD to document the composite landing page
```

*BMAD Consideration: The application now pulls from multiple data sources and automatically maintains its own documentation. This shows a fully self-managing application that tracks its own evolution.*

---

### BMAD Integration Throughout (Suggestive, Not Prescriptive)

The beauty of this approach:

**During Framework Build (Phase 2):**
- BMAD provides structure, quality gates, story-driven development
- Traditional agent-assisted coding with guardrails

**During Self-Editing (Phases 5-8):**
- The application becomes BMAD-aware
- Agent can reference/update BMAD artifacts through conversation
- Quality gates still apply (active story requirement)
- PRD auto-updates as features are added
- Code quality validation using Claude Code agent
- All happening through natural language in a text box

**Progressive Enhancement of BMAD Integration:**
1. **Step 5.4**: Manual PRD update - showing the capability
2. **Step 6**: Enable auto-update + code quality validation
3. **Step 7**: Automatic PRD updates happen seamlessly
4. **Step 8**: Full self-documentation in action

**Demonstration Ideas:**
- Show BMAD files being created by the analyst
- Show story-driven development building the framework
- Show the framework enforcing BMAD rules (hooks)
- Demonstrate code quality validation mid-stream
- Show PRD auto-update evolution from manual → automatic
- Optionally: Show the agent creating its own story files

This creates a recursive demonstration: **BMAD builds a self-editing application → that application enforces BMAD → validates its own quality → documents its own evolution → all through conversation.**

---

## File Structure

```
my-mini-claude-shop/
├── bmad/
│   └── bmm/
│       ├── docs/
│       │   ├── prd.md                    # Product requirements
│       │   └── architecture.md           # System design
│       └── stories/
│           ├── ACTIVE_STORY.md           # Current work pointer
│           ├── story-001-seed-data.md
│           └── story-002-listing-page.md
├── data/
│   └── products.json                     # Product data store
├── public/
│   ├── index.html                        # Landing (chat interface)
│   ├── products.html                     # Generated listing
│   └── product-{slug}.html               # Generated details
├── server.ts                             # Express + Agent SDK (≤200 LOC)
├── package.json
└── .env                                  # ANTHROPIC_API_KEY
```

---

## BMAD v4 Integration

### Minimal BMAD Setup

#### PRD (`bmad/bmm/docs/prd.md`)
```markdown
# Mini Claude Shop — Product Requirements

## Goals
- Conversational agent can add products to JSON
- Agent generates product listing pages
- Agent generates product detail pages
- Agent improves landing page to promote products

## Non-Goals
- Cart/checkout, authentication, payments

## Requirements
- Frontend served from /public with Tailwind CDN
- Data lives in ./data/products.json
- Agent edits constrained to /public and /data
- Product pages use pattern: /product-{slug}.html
- Landing shows 3 promoted products when data exists
```

#### Story 001 (`bmad/bmm/stories/story-001-seed-data.md`)
```markdown
## Objective
Seed products.json with initial items and generate listing page

## Acceptance Criteria
- products.json contains >= 3 products (name, slug, price, category)
- /products.html renders grid of products
- Links point to /product-{slug}.html (404 initially OK)
```

#### Active Story (`bmad/bmm/stories/ACTIVE_STORY.md`)
```markdown
story-001-seed-data.md
```

### Quality Gate Hook
Before allowing file writes, verify ACTIVE_STORY.md exists:
```typescript
const hooks = {
  async beforeToolCall(ctx: any) {
    if (ctx.toolName === 'write_file') {
      const activeStory = await fs.readFile(
        'bmad/bmm/stories/ACTIVE_STORY.md'
      ).catch(() => null);

      if (!activeStory) {
        throw new Error(
          'No ACTIVE_STORY.md - create story before coding'
        );
      }
    }
  }
};
```

---

## Implementation Outline

### Server (≤200 LOC)

```typescript
import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { Agent, Tool, runAgent } from '@anthropic-ai/claude-agent-sdk';
import 'dotenv/config';

const app = express();
app.use(express.json());
app.use(express.static('public'));

const DATA = path.join(process.cwd(), 'data', 'products.json');
const PUB = path.join(process.cwd(), 'public');

// Safety helper
const safe = (p) => {
  const full = path.resolve(p);
  if (!full.startsWith(PUB) && !full.startsWith(path.dirname(DATA))) {
    throw new Error('Blocked: only /public and /data writable');
  }
  return full;
};

// Tool 1: Read products
const read_json: Tool = {
  name: 'read_json',
  description: 'Read ./data/products.json',
  inputSchema: { type: 'object', properties: {} },
  handler: async () => {
    try {
      return await fs.readFile(DATA, 'utf8');
    } catch {
      return '[]';
    }
  }
};

// Tool 2: Write products
const write_json: Tool = {
  name: 'write_json',
  description: 'Write ./data/products.json',
  inputSchema: {
    type: 'object',
    properties: { json: { type: 'string' } },
    required: ['json']
  },
  handler: async ({ json }) => {
    await fs.mkdir(path.dirname(DATA), { recursive: true });
    await fs.writeFile(safe(DATA), json, 'utf8');
    return 'products.json updated';
  }
};

// Tool 3: Generate pages
const write_file: Tool = {
  name: 'write_file',
  description: 'Write HTML to /public',
  inputSchema: {
    type: 'object',
    properties: {
      relpath: { type: 'string' },
      content: { type: 'string' }
    },
    required: ['relpath', 'content']
  },
  handler: async ({ relpath, content }) => {
    const target = safe(path.join(PUB, relpath));
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, content, 'utf8');
    return `wrote ${path.basename(target)}`;
  }
};

// Quality gate hook
const hooks = {
  async beforeToolCall(ctx) {
    if (ctx.toolName === 'write_file') {
      const active = path.join(
        process.cwd(),
        'bmad/bmm/stories/ACTIVE_STORY.md'
      );
      try {
        await fs.access(active);
      } catch {
        throw new Error('No ACTIVE_STORY - set story first');
      }
    }
  }
};

// Agent definition
const agent = new Agent({
  name: 'ProductBuilder',
  systemPrompt: `
You are a careful product site generator. You can:
- read_json / write_json to manage ./data/products.json
- write_file to create HTML pages in /public

Rules:
- Use Tailwind CDN classes for styling
- Listing page: grid of products linking to /product-{slug}.html
- Detail page: title, price, description, attributes, back link
- Landing page: hero + 3 pinned products
- Never write outside /public or /data

Return friendly summary of changes.
  `,
  tools: [read_json, write_json, write_file],
  hooks
});

// Chat endpoint (SSE)
app.post('/chat', async (req, res) => {
  try {
    const input = String(req.body?.message || '').slice(0, 2000);
    const result = await runAgent({ agent, input });
    res.json({ output: result.outputText });
  } catch (e) {
    res.status(400).json({ error: String(e.message || e) });
  }
});

app.listen(3000, () => console.log('http://localhost:3000'));
```

### Frontend (index.html)

```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Mini Claude Shop</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="min-h-screen bg-gray-50">
  <div class="max-w-3xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-4">Mini Claude Shop</h1>

    <p class="mb-2 text-gray-600">
      Visit <a href="/products.html" class="text-blue-600 underline">
        Products
      </a> (will be generated by agent)
    </p>

    <div class="mt-8 p-4 bg-white rounded-xl shadow">
      <h2 class="font-semibold mb-2">Conversational Builder</h2>
      <p class="text-sm text-gray-500 mb-3">
        Talk to the agent to build your product catalog
      </p>

      <textarea
        id="msg"
        class="w-full border rounded p-2"
        rows="4"
        placeholder="e.g., Create 3 demo products and generate listing page"
      ></textarea>

      <button
        id="send"
        class="mt-3 px-4 py-2 rounded bg-black text-white"
      >
        Send
      </button>

      <pre id="log" class="whitespace-pre-wrap mt-4 text-sm text-gray-700"></pre>
    </div>
  </div>

  <script>
    document.getElementById('send').onclick = async () => {
      const msg = document.getElementById('msg').value.trim();
      if (!msg) return;

      const res = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg })
      });

      const data = await res.json();
      document.getElementById('log').textContent =
        data.output || JSON.stringify(data, null, 2);
    };
  </script>
</body>
</html>
```

---

## Setup & Run

### Install Dependencies
```bash
npm init -y
npm install express @anthropic-ai/claude-agent-sdk
npm install -D typescript tsx @types/express @types/node
```

### Authentication (No API Credits Required!)

Use Claude's built-in OAuth authentication instead of API keys:

```bash
# One-time setup - login via browser
claude auth login

# This creates a persistent OAuth session
# The SDK will automatically use this session
# No .env file or API key needed!
```

**Benefits:**
- ✅ No API credits consumed
- ✅ Uses your Claude Pro/Team subscription
- ✅ Same authentication as Claude Code CLI
- ✅ Persistent across sessions

### Optional: Environment Config
```bash
# .env (optional - only for custom port)
PORT=3000
```

### Run
```bash
npm run dev
# or
tsx watch server.ts

# Open http://localhost:3000
```

**Note**: The server will use your Claude CLI auth session automatically. If you get auth errors, run `claude auth login` first.

---

## Key Learnings from Research

### From Video Transcripts

1. **Python vs JavaScript**: Both supported by Claude Agent SDK
2. **Streaming**: SSE (Server-Sent Events) works well for chat UX
3. **Tools Pattern**: MCP (Model Context Protocol) for custom tools
4. **File Operations**: Built-in read/write with permission controls
5. **System Prompts**: Define agent behavior and constraints
6. **Hooks**: Quality gates before tool execution

### SDK Patterns

- `query()` - Send message to agent
- `receive()` - Stream responses
- `tools` - Custom function definitions
- `hooks.beforeToolCall` - Validation/guardrails
- `systemPrompt` - Agent personality and rules
- `CodeAgentOptions` - CWD, permissions, allowed tools

### Safety & Constraints

- Sandbox file operations to specific directories
- Require active story before code generation
- Validate tool inputs with JSON schemas
- Use permission mode: `accept_edits`
- Constrain CWD (current working directory)

---

## Video Outline

### Introduction (2 min)
- What is Claude Agent SDK
- What is BMAD Method v4
- The big idea: Building a framework that builds apps via conversation
- Demo preview: "Watch me build 200 lines, then watch IT build everything else"

---

### Phase 1: Concept & Planning with BMAD (4 min)

**In Claude Code/VSCode:**
- Introduce the meta-framework concept
- Use BMAD Analyst agent to create PRD
- Show PRD structure (framework requirements, NOT product requirements)
- Generate initial stories for framework development
- Show architecture diagram

**Key Artifacts:**
- `bmad/bmm/docs/prd.md`
- `bmad/bmm/stories/story-001-server-setup.md`
- `bmad/bmm/stories/ACTIVE_STORY.md`

---

### Phase 2: Build the Framework (12 min)

**Still in VSCode - Traditional Coding:**

**Part 2.1: Server Setup (6 min)**
- Install dependencies (Express, Claude Agent SDK)
- Authenticate with `claude auth login` (show OAuth flow)
- Create `server.ts` with Express boilerplate
- Define 3 generic tools: read_json, write_json, write_file
- Show sandboxing/safety helpers
- Add BMAD quality gate hook (requires ACTIVE_STORY.md)

**Part 2.2: Agent Configuration (3 min)**
- Create Agent instance with generic system prompt
- Wire up tools and hooks
- Add `/chat` endpoint with SSE streaming
- Show the code stays under 200 lines

**Part 2.3: Client Interface (3 min)**
- Create `public/index.html` with text box
- Add Tailwind CDN
- Wire up fetch to `/chat` endpoint
- Add placeholder nav structure (Products, Blog - empty for now)

**Test:** Start server, open browser, verify text box works

---

### Phase 3: The Pivot - Using the Framework (12 min)

**Leave VSCode. Everything happens in the browser at localhost:3000**

**Part 3.1: Products Example (5 min)**
- "Create 3 products with id, name, price, category"
- Show `data/products.json` created
- "Generate a product listing page"
- Show `public/products.html` created with grid
- Click Products nav → see listing
- "Create product detail page template"
- Click product → see detail page
- "Add material, capacity, color attributes and update listing"
- Show enriched data + updated page

**Part 3.2: Landing Page (2 min)**
- "Create landing page featuring 3 pinned products"
- Show `index.html` updated with hero + cards

**Part 3.3: Blog Example (3 min)**
- "Create blog system: 5 posts with title, date, author, content"
- "Generate blog list and detail pages"
- Show `data/blog.json` + `public/blog.html` created
- Click Blog nav → see new section

**Part 3.4: Integration (2 min)**
- "Update landing to include latest 2 blog posts below products"
- Show agent pulling from both data sources
- Landing page now composite of products + blog

---

### Phase 4: BMAD Throughout (3 min)

**Demonstrate BMAD Awareness:**
- Show how framework was built with story-driven development
- Demonstrate quality gate: Try to write file without ACTIVE_STORY → blocked
- (Optional) Show agent updating its own story: "Write story-005 for blog feature"
- (Optional) Show agent checking criteria: "Does landing page fulfill story-004?"

**The Recursive Beauty:**
"BMAD built the framework → The framework enforces BMAD → While building apps conversationally"

---

### Conclusion (3 min)
- Recap: 200 lines of framework code
- Everything else (products, blog, pages) built via conversation
- Framework is domain-agnostic and reusable
- BMAD maintained discipline throughout
- Extension ideas: Add more data types, implement versioning, add validation tools
- Resources: Claude Agent SDK docs, BMAD v6 repo

**Total: ~36 minutes**

---

### Optional Segments (Can Be Cut)

- **Deep Dive: Tool Implementation** (5 min) - Show detailed tool code
- **BMAD Story Writing Live** (3 min) - Write a new story file during Phase 1
- **Error Handling Demo** (2 min) - Show what happens when sandbox is violated
- **Multi-Data Source Pattern** (3 min) - Explain how landing page composites work

---

## Extension Ideas

### Short-term
- Add product search functionality
- Category filtering
- Product image upload (via URLs)
- Schema validation tool
- Bulk import from CSV

### Medium-term
- Multi-agent workflow (Planner → Builder → Reviewer)
- Version control for generated pages
- A/B test different layouts
- SEO optimization agent
- Accessibility checker

### Advanced
- Real-time WebSocket updates
- Database integration (SQLite/PostgreSQL)
- Shopping cart functionality
- Admin dashboard
- Deployment to Vercel/Railway

---

## Resources

### Documentation
- [Claude Agent SDK Docs](https://docs.anthropic.com/en/docs/agents-sdk)
- [BMAD Method v4](https://github.com/bmad-code-org/BMAD-METHOD)

### Related Projects
- [Claude Code](https://github.com/anthropics/claude-code)
- [MCP (Model Context Protocol)](https://modelcontextprotocol.io/)

---

## Success Metrics

### Code Quality
- Backend under 200 lines
- No external dependencies beyond SDK
- Clean separation of concerns
- Type-safe TypeScript

### BMAD Alignment
- PRD defines requirements
- Stories guide implementation
- Active story enforced by hooks
- JIT approach demonstrated

### Demo Value
- Shows self-modifying application
- Demonstrates agent autonomy
- Illustrates iterative development
- Teaches SDK integration

### Audience Learning
- Understands agent tools concept
- Knows how to add custom tools
- Grasps BMAD workflow
- Can extend the example
