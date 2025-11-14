# Project Brief: BMAD + Claude Agent SDK Self-Editing Application

## Executive Summary

**BMAD + Claude Agent SDK: Self-Editing Application Framework** is a meta-application that enables conversation-driven software development. Users interact with a chat interface to build and modify web applications in real-time without writing code. The framework combines Claude's Agent SDK with BMAD Method v4 quality gates to create a disciplined, self-modifying application that evolves through natural language conversation.

**Primary Problem:** Traditional web development requires extensive coding knowledge and creates barriers for rapid prototyping and iteration. Even experienced developers face friction when building simple data-driven applications.

**Target Market:**
- Developers learning AI agent integration and self-modifying systems
- Technical educators teaching conversational AI concepts
- Rapid prototypers needing quick MVPs
- BMAD Method practitioners demonstrating quality-gated development

**Key Value Proposition:** Build a 200-line framework once, then use conversation to generate unlimited applications—demonstrating how BMAD-disciplined agents can create self-editing software that maintains its own documentation and enforces quality gates.

## Problem Statement

**Current State & Pain Points:**

Modern web development, even for simple applications, requires:
- Multiple technology decisions (frontend framework, backend server, database, deployment)
- Boilerplate setup and configuration overhead
- Manual file creation and editing for data structures and UI pages
- Context switching between code editor, terminal, browser, and documentation
- Steep learning curve for non-developers wanting to prototype ideas

Even experienced developers face friction when building simple data-driven applications (product catalogs, blogs, portfolios). The time from "I have an idea" to "I can see it working" is unnecessarily long.

**Impact of the Problem:**

- **Learning barrier**: Aspiring developers struggle to understand AI agent integration due to complex examples
- **Prototyping friction**: Rapid iteration requires too much boilerplate and manual setup
- **Teaching challenges**: Educators lack simple, working demonstrations of self-modifying systems
- **Quality gaps**: Self-editing applications built without disciplined workflows often become unmaintainable

**Why Existing Solutions Fall Short:**

- **Low-code platforms** (Bubble, Webflow): Not educational, hide the framework, can't demonstrate agent concepts
- **AI coding assistants** (GitHub Copilot, Cursor): Assist human coding but don't enable conversation-driven development
- **Claude Agent SDK examples**: Often complex production scenarios, not minimal educational demos
- **BMAD Method**: Lacks concrete demonstrations of agent-built, quality-gated applications

**Urgency & Importance:**

The intersection of three trends makes this timely:
1. **Claude Agent SDK release** (2024/2025) - New capability needing educational content
2. **BMAD Method v4 maturity** - Quality gates ready for agent integration
3. **Growing interest in self-modifying systems** - Market demand for practical examples

Developers and educators need a working reference implementation NOW to understand these concepts before building production systems.

## Proposed Solution

**Core Concept & Approach:**

Build a **minimal meta-framework** (~200 lines of TypeScript) that enables conversation-driven application development. The framework provides:

1. **Express + Claude Agent SDK backend** with three domain-agnostic tools:
   - `read_json` - Read any JSON file from `/data` directory
   - `write_json` - Create/update any JSON file in `/data`
   - `write_file` - Create/update any HTML/CSS/JS file in `/public`

2. **React + Socket.io frontend** with real-time streaming chat interface (shadcn/ui + Vercel AI Elements)

3. **BMAD Method v4 integration**:
   - Quality gate hooks (require active story before file writes)
   - Story-driven framework development
   - Self-documenting capability (agent can update its own PRD)

4. **NPM workspaces monorepo** for shared TypeScript types and clean architecture

**Key Differentiators:**

- **Educational simplicity**: 200 LOC proves the concept is viable and teachable
- **Domain-agnostic tools**: Framework doesn't "know about" products or blogs—it evolves based on conversation
- **BMAD enforcement**: Only self-editing framework with built-in quality gates
- **Recursive demonstration**: BMAD builds the framework → Framework enforces BMAD → Application self-documents
- **No API costs**: Uses Claude CLI OAuth (`claude auth login`), not API credits

**Why This Solution Succeeds:**

- **Minimal cognitive load**: Developers can understand entire codebase in minutes
- **Practical demonstration**: Actually works, not just theoretical concept
- **Reusable pattern**: Framework can be adapted for different domains
- **Quality gates from day one**: BMAD prevents "vibe coding" from becoming unmaintainable
- **Video-ready**: Simple enough to demonstrate in 30-40 minute educational video

**High-Level Vision:**

A developer watches the video, clones the repo, runs `npx bmad-method install`, and within an hour has:
1. Built the framework using BMAD workflow
2. Used conversation to create a product catalog
3. Extended it to add a blog system
4. Understood how to integrate Claude Agent SDK with quality gates

## Target Users

### Primary User Segment: Learning-Focused Developers

**Demographic/Firmographic Profile:**
- Mid-level to senior developers (2-8 years experience)
- TypeScript/JavaScript background
- Active in developer education communities (YouTube, Dev.to, Reddit)
- Early adopters of new AI tools and frameworks
- Geographic: Global, English-speaking primarily
- Employment: Mix of employed developers (60%) and indie builders (40%)

**Current Behaviors & Workflows:**
- Watch 30-60 minute technical tutorial videos weekly
- Clone example repos to understand new concepts
- Experiment with AI coding assistants (Copilot, Cursor, Claude Code)
- Build side projects to learn new technologies
- Share learnings through blog posts, tweets, or videos

**Specific Needs & Pain Points:**
- Need minimal, working examples before tackling complex documentation
- Frustrated by "enterprise-scale" examples when learning basics
- Want to understand self-modifying systems without reading research papers
- Struggle to integrate multiple new concepts (Agent SDK + BMAD) simultaneously
- Need reference implementations they can modify and extend

**Goals They're Trying to Achieve:**
- Understand Claude Agent SDK integration patterns
- Learn how to build quality gates into AI workflows
- Create their own agent-based applications
- Teach others about conversational AI development
- Build credibility in AI/agent development space

### Secondary User Segment: Technical Educators & Content Creators

**Demographic/Firmographic Profile:**
- Experienced developers (5+ years) creating educational content
- YouTube creators, course instructors, technical writers
- Active on platforms: YouTube, Udemy, egghead.io, Dev.to
- Audience size: 1,000 - 100,000+ followers
- Monetization: Ad revenue, course sales, sponsorships, Patreon

**Current Behaviors & Workflows:**
- Research emerging technologies for content opportunities
- Build demo applications for video tutorials
- Need working examples that fit 20-40 minute video format
- Create supporting repositories for students to clone
- Respond to student questions and troubleshoot common issues

**Specific Needs & Pain Points:**
- Need production-quality demos that are simple enough to teach
- Struggle to find "just right" complexity examples (not too simple, not too complex)
- Want working code that demonstrates multiple concepts simultaneously
- Need clear narrative arc for video structure (build framework → use framework)
- Require examples they can confidently recommend to students

**Goals They're Trying to Achieve:**
- Create high-value educational content on trending topics
- Demonstrate practical applications of new technologies
- Help students understand complex concepts through working examples
- Build reputation as expert in AI agent development
- Generate course/content revenue from timely, relevant material

## Goals & Success Metrics

### Business Objectives

- **Educational reach**: 1,000+ developers clone/fork the repository within 3 months of video release
- **Content amplification**: 5+ technical educators create derivative content (videos, courses, blog posts) within 6 months
- **Community engagement**: 50+ GitHub stars, 10+ meaningful PRs/issues demonstrating understanding
- **BMAD adoption**: 100+ developers install BMAD Method v4 through this project (tracked via npm analytics)
- **Brand positioning**: Establish AppyDave as thought leader in quality-gated AI agent development

### User Success Metrics

- **Time to "aha moment"**: User can build and run framework in < 60 minutes from video start
- **Comprehension**: 80%+ of users who complete walkthrough can explain the three-tool pattern
- **Extension rate**: 30%+ of users modify framework for their own domain (measured via forked repo changes)
- **Completion rate**: 60%+ of users who start video/tutorial complete the full demonstration
- **Satisfaction**: 4.5+ rating on educational value (YouTube likes, course reviews, survey feedback)

### Key Performance Indicators (KPIs)

- **Video performance**: 5,000+ views, 8%+ CTR, 50%+ average view duration (if 40-min video)
- **Repository engagement**: 1,000+ clones, 50+ stars, 200+ unique visitors/week
- **BMAD Method installs**: 100+ `npx bmad-method install` executions attributable to this project
- **Documentation quality**: Zero critical issues filed related to unclear/missing instructions
- **Community growth**: 10+ active community members helping others (Discord/GitHub discussions)
- **Content derivatives**: 5+ blog posts, videos, or courses created by others referencing this project
- **Conversion to BMAD**: 20%+ of users explore other BMAD content after completing this tutorial

## MVP Scope

### Core Features (Must Have)

- **Epic 1 - Monorepo Foundation**: NPM workspaces structure (root, server, client, shared) with TypeScript configuration, basic Express server, and minimal HTML client that proves end-to-end communication works
  - *Rationale*: Foundation must be solid before adding complexity; proves communication layer works

- **Epic 2 - Claude Agent SDK Integration**: Event-driven agent loop with three custom tools (`read_json`, `write_json`, `write_file`), BMAD quality gate hooks (active story requirement), Socket.io streaming for real-time responses
  - *Rationale*: Core value proposition; demonstrates agent capabilities and BMAD discipline

- **Epic 3 - Production Chat UI**: React 19 + Vite 7 frontend with shadcn/ui components, Vercel AI Elements chat interface, Socket.io client for streaming, professional styling with TailwindCSS 4
  - *Rationale*: Production-quality UI validates framework is demo-worthy; streaming UX critical for perceived responsiveness

- **BMAD Artifacts**: Complete PRD, architecture document, 10-13 stories across 3 epics, active story tracking mechanism
  - *Rationale*: Demonstrates BMAD workflow; creates self-documenting project structure

- **Documentation**: Setup guide (authentication, installation, running), architecture overview, video script/demo sequence, security warnings
  - *Rationale*: Educational value requires excellent docs; security disclaimer critical for responsible distribution

- **Working Demo Sequence**: Step-by-step demonstration creating product catalog → landing page → blog system through conversation
  - *Rationale*: Proves the concept works; provides concrete learning path

### Out of Scope for MVP

- Database integration (SQLite, PostgreSQL) - Use JSON files only
- Authentication/authorization for the generated applications
- Multi-user support or session management
- File upload capabilities beyond text
- Production deployment configuration (Docker, cloud hosting)
- Advanced error recovery or undo functionality
- Testing framework integration (Jest, Playwright)
- CI/CD pipeline setup
- Advanced BMAD features (multi-agent workflows, code review agents)
- MCP (Model Context Protocol) integration
- Custom UI themes or dark mode
- Internationalization (i18n)

### MVP Success Criteria

**The MVP is successful when:**

1. **Builds successfully**: Developer can run `npm install && npm run dev` and see working application in < 5 minutes
2. **Framework completeness**: Server + client totals ≤ 250 lines of core framework code (allowing small buffer beyond 200 LOC target)
3. **Conversation works**: User can type "create 3 products" → agent creates `data/products.json` → response streams back
4. **Quality gates enforce**: Attempting file write without `ACTIVE_STORY.md` throws clear error message
5. **Demo sequence completes**: Product catalog → landing page → blog system → composite page all generate successfully through conversation
6. **Video-ready**: Complete demonstration fits within 40-minute video including explanation, build, and usage
7. **Documentation clarity**: External developer (not project creator) can complete walkthrough without assistance
8. **BMAD workflow**: PRD and architecture documents accurately reflect implementation; stories guide development

## Post-MVP Vision

### Phase 2 Features

**Enhanced Agent Capabilities:**
- Additional tools: `read_file`, `list_directory`, `execute_command` for broader file operations
- Schema validation tool to enforce data structure consistency
- Version control integration (git operations through conversation)
- Rollback/undo mechanism for mistaken changes

**Multi-Agent Workflows:**
- Planner agent → Builder agent → Reviewer agent pipeline
- Specialized agents for different domains (e-commerce, content, analytics)
- Agent collaboration patterns (handoff, parallel execution, consensus)

**Production Readiness:**
- Database integration (SQLite for local, PostgreSQL for deployed)
- User authentication and session management
- Deploy-ready configuration (Docker, Railway, Vercel)
- Environment-based configuration management

### Long-term Vision

**Educational Ecosystem (6-12 months):**
- Video course series: "Building with Claude Agent SDK" (6-8 modules)
- Advanced BMAD integration patterns course
- Community-contributed agent tool library
- Interactive playground for experimenting with tools and prompts

**Framework Evolution (12-18 months):**
- Plugin architecture for custom tool sets
- Visual workflow builder for multi-agent systems
- Real-time collaboration (multiple users editing same application)
- Agent observability dashboard (tool usage, decision paths, performance metrics)

**Production Use Cases (18-24 months):**
- Internal tools generator for businesses
- Rapid prototyping platform for startups
- Educational platform for teaching AI agent concepts
- Low-code solution for non-technical domain experts

### Expansion Opportunities

**Adjacent Markets:**
- **Code education**: Partner with coding bootcamps for curriculum integration
- **Enterprise training**: Corporate workshops on AI agent development
- **Research collaboration**: Academic partnerships studying self-modifying systems
- **Open source ecosystem**: BMAD plugin marketplace for quality-gated tools

**Technology Integration:**
- MCP (Model Context Protocol) for standardized tool interfaces
- LangChain/LangGraph integration for complex workflows
- Other LLM providers (OpenAI, local models) for comparison
- Voice interface for conversational development

**Content Derivatives:**
- Book: "Quality-Gated AI Agent Development with BMAD"
- Workshop series: Hands-on BMAD + Agent SDK training
- Certification program: BMAD Practitioner certification
- Conference talks: Presenting at JSConf, React Summit, AI Engineer Summit

## Technical Considerations

### Platform Requirements

- **Target Platforms**: Web-based application (browser + Node.js server)
- **Browser/OS Support**:
  - Modern browsers: Chrome/Edge 120+, Firefox 121+, Safari 17+
  - Node.js 20+ (LTS) required for server
  - OS: macOS, Linux, Windows (WSL2 recommended for Windows)
- **Performance Requirements**:
  - Server startup < 3 seconds
  - First response from agent < 5 seconds (cold start)
  - Streaming latency < 500ms per chunk
  - UI render time < 100ms (React fast refresh)

### Technology Preferences

- **Frontend**:
  - React 19 (latest stable) + TypeScript 5.7+
  - Vite 7 for dev server and build tooling
  - shadcn/ui for base components (headless UI primitives)
  - Vercel AI Elements for pre-built chat interface
  - TailwindCSS 4 for styling (utility-first)
  - Socket.io-client for real-time streaming

- **Backend**:
  - Express 5 + TypeScript
  - Claude Agent SDK (`@anthropic-ai/claude-agent-sdk`)
  - Socket.io server for WebSocket communication
  - Node.js filesystem APIs (no external database)

- **Database**:
  - JSON files in `/data` directory (no database for MVP)
  - Future: SQLite for local, PostgreSQL for production

- **Hosting/Infrastructure**:
  - Local development: `localhost:3000` (Express) + `localhost:5173` (Vite)
  - Future deployment: Railway, Vercel, or self-hosted VPS

### Architecture Considerations

- **Repository Structure**:
  - NPM workspaces monorepo (proven pattern from Storyline App)
  - Structure: `packages/server`, `packages/client`, `packages/shared`
  - Shared TypeScript types between frontend/backend
  - Single `npm run dev` command to start both server and client

- **Service Architecture**:
  - Single Express server handling both API and static assets
  - Socket.io for bidirectional real-time communication
  - Claude Agent SDK runs in server process (not separate service)
  - No microservices complexity for MVP

- **Integration Requirements**:
  - Claude CLI OAuth authentication (`claude auth login`)
  - No external APIs beyond Claude Agent SDK
  - File system access limited to `/data` and `/public` directories
  - No third-party services (analytics, monitoring, etc.) for MVP

- **Security/Compliance**:
  - **⚠️ EDUCATIONAL DEMO ONLY** - Not production-ready
  - Sandboxed file operations (`/data` and `/public` only)
  - BMAD quality gates prevent arbitrary code execution
  - No user authentication (single-user localhost only)
  - Security warnings in README and documentation
  - Future: Input validation, rate limiting, user authentication

## Constraints & Assumptions

### Constraints

- **Budget**:
  - $0 direct costs (uses existing Claude Pro/Team subscription via OAuth)
  - Developer time: ~40-60 hours for MVP (planning, development, video)
  - No paid services, APIs, or infrastructure for MVP

- **Timeline**:
  - Planning & documentation: 1 week
  - Development (3 epics): 2-3 weeks
  - Video recording & editing: 1 week
  - Total MVP timeline: 4-5 weeks
  - Post-launch iteration based on community feedback

- **Resources**:
  - Solo developer (David Cruwys) for MVP
  - Community contributions welcome post-launch
  - No dedicated QA, design, or DevOps resources
  - Leverage existing BMAD Method v4 infrastructure

- **Technical**:
  - 200-250 LOC maximum for core framework (hard constraint)
  - Localhost-only for MVP (no deployment infrastructure)
  - Single-user, no concurrency support
  - File-based storage only (no database)
  - No mobile/tablet optimization (desktop browser only)

### Key Assumptions

- Claude Agent SDK remains stable and available via OAuth authentication
- BMAD Method v4 npm package continues to be maintained and accessible
- Target audience has Node.js 20+ and modern browser installed
- Developers comfortable with TypeScript/React patterns
- Claude Pro/Team subscription provides sufficient rate limits for demo usage
- Educational positioning attracts sufficient audience (1,000+ in 3 months)
- Video format (30-40 minutes) appropriate for target audience retention
- NPM workspaces pattern familiar enough to target developers
- Security warnings sufficient deterrent for production misuse
- Community will contribute improvements if MVP demonstrates value
- shadcn/ui and Vercel AI Elements remain free and open source
- Socket.io continues to be industry standard for real-time communication
- GitHub provides adequate free tier for repository hosting and analytics
- No breaking changes in React 19, Vite 7, or Express 5 during development

## Risks & Open Questions

### Key Risks

- **Claude Agent SDK stability**: SDK is relatively new; breaking changes or deprecation could break the framework
  - *Impact*: High - core dependency failure
  - *Mitigation*: Monitor Anthropic announcements, version pin dependencies, maintain fallback documentation

- **200 LOC constraint unachievable**: Framework complexity may exceed target line count
  - *Impact*: Medium - weakens "minimal framework" positioning
  - *Mitigation*: 250 LOC buffer already added; aggressive refactoring; accept if educational value maintained

- **Low adoption/engagement**: Fails to reach 1,000 clones in 3 months
  - *Impact*: Medium - reduces brand positioning impact
  - *Mitigation*: Cross-promote on BMAD channels, engage developer communities, create derivative content

- **Security misuse**: Users deploy to production despite warnings
  - *Impact*: High - reputation risk if exploited
  - *Mitigation*: Prominent warnings, require acknowledgment in README, create production hardening guide

- **Video complexity**: 40-minute format too long, viewers drop off
  - *Impact*: Medium - reduces completion rate
  - *Mitigation*: Timestamp navigation, create shorter "quick start" version, modular chapter structure

- **BMAD overhead perception**: Quality gates seen as unnecessary complexity for demo
  - *Impact*: Medium - dilutes BMAD value proposition
  - *Mitigation*: Clearly demonstrate benefits, make gates optional flag, show "vibe coding" comparison

- **Technology churn**: React 19/Vite 7 breaking changes during development
  - *Impact*: Low - delays timeline
  - *Mitigation*: Version pinning, active monitoring of release notes, community beta testing

### Open Questions

- Should we include MCP integration in MVP or defer to Phase 2?
- Is 40 minutes optimal video length or should we target 25-30 minutes?
- Do we need video chapter markers or is a single continuous flow better?
- Should BMAD quality gates be optional (flag to disable) or always enforced?
- Is the three-tool pattern (read_json, write_json, write_file) sufficient or should we add a fourth?
- Should we create a Discord community immediately or wait for adoption signals?
- Do we need a companion blog post series or is the video sufficient?
- Should the demo use product catalog or a different domain (todo app, blog, etc.)?
- Is shadcn/ui the right choice or should we use headless Radix UI directly?
- Do we need GitHub issue templates or let community evolve organically?

### Areas Needing Further Research

- **Streaming performance**: Benchmark Socket.io vs SSE vs WebSockets for agent response streaming
- **Claude rate limits**: Validate OAuth subscription rate limits sufficient for demo usage patterns
- **Vercel AI Elements maturity**: Assess production readiness and documentation quality
- **NPM workspaces dev experience**: Test concurrent dev server startup (server + client simultaneously)
- **shadcn/ui + TailwindCSS 4 compatibility**: Verify no breaking changes between versions
- **Browser compatibility**: Test across Chrome/Firefox/Safari for Socket.io + streaming
- **Video editing workflow**: Determine screen recording setup (resolution, frame rate, editing tools)
- **Community platform**: Evaluate Discord vs GitHub Discussions for community engagement

## Appendices

### A. Research Summary

**Claude Agent SDK Research:**
- Reviewed official documentation at docs.anthropic.com/agents-sdk
- Analyzed example implementations in `/Users/davidcruwys/dev/js_3rd/claude-agent-sdk-typescript/`
- Studied OAuth authentication flow (no API key required)
- Validated custom tool patterns and hook integration
- Confirmed streaming response capabilities via event-driven architecture

**BMAD Method v4 Research:**
- Examined BMAD core at `/Users/davidcruwys/dev/js_3rd/BMAD-METHOD/`
- Reviewed workflow-init, tech-spec, and story generation patterns
- Validated quality gate hook integration with agent SDK
- Confirmed PRD/architecture sharding for maintainability
- Studied existing BMAD projects for workflow patterns

**Technology Stack Validation:**
- Verified NPM workspaces pattern from Storyline App project
- Confirmed React 19 + Vite 7 compatibility
- Reviewed shadcn/ui component library and Vercel AI Elements
- Validated Socket.io for real-time streaming use cases
- Tested TailwindCSS 4 syntax and migration path

**Competitive Analysis:**
- Low-code platforms (Bubble, Webflow) - Not educational, hide implementation
- AI coding assistants (Copilot, Cursor) - Assist coding, don't enable conversation-driven development
- Other agent frameworks (LangChain, AutoGPT) - Complex, production-focused, not minimal demos
- Existing Claude SDK examples - Enterprise scenarios, lack BMAD integration

### B. References

**Documentation:**
- Claude Agent SDK: https://docs.anthropic.com/en/docs/agents-sdk
- BMAD Method v4: https://github.com/bmad-code-org/BMAD-METHOD
- React 19 Documentation: https://react.dev/
- Vite 7 Documentation: https://vitejs.dev/
- Socket.io Documentation: https://socket.io/docs/
- shadcn/ui: https://ui.shadcn.com/
- Vercel AI Elements: https://sdk.vercel.ai/docs

**Local Resources:**
- Claude Agent SDK source: `/Users/davidcruwys/dev/js_3rd/claude-agent-sdk-typescript/`
- BMAD Method source: `/Users/davidcruwys/dev/js_3rd/BMAD-METHOD/`
- Curated BMAD docs: `/Users/davidcruwys/dev/ad/brains/bmad-method/`
- Curated Agent SDK docs: `/Users/davidcruwys/dev/ad/brains/anthropic-claude/agent-sdk/`

**Planning Documents:**
- Project Reference: `docs/planning/project-reference.md`
- Tech Stack: `docs/planning/tech-stack.md`
- Video Strategy: `docs/planning/video-strategy.md`
- Demo Sequence: `docs/planning/demo-sequence.md`

## Next Steps

### Immediate Actions

1. **Generate PRD**: Load PM agent and run `*create-prd` using this project brief and planning documents as input to create PRD with 3 epics and ~10-13 stories

2. **Create Architecture**: Load Architect agent to create system architecture document from PRD

3. **Shard Documents**: Use PO agent to shard both documents: `@po shard docs/prd.md` then `@po shard docs/architecture.md`

4. **Verify BMAD artifacts**: Confirm sharded folders exist with correct structure: `docs/prd/` (with epic files) and `docs/architecture/` (with component files)

5. **Set up development environment**: Install Node.js 20+, authenticate with `claude auth login`, prepare workspace

6. **Begin Epic 1 implementation**: Use SM agent to draft first story from sharded docs and start monorepo foundation development using BMAD v4 workflow

### PM Handoff

This Project Brief provides the full context for **BMAD + Claude Agent SDK: Self-Editing Application Framework**.

**For Product Manager (John):**

Please start in **PRD Generation Mode**. Review this brief thoroughly to create the PRD section by section following the BMAD v4 PRD template. Key inputs to reference:

- This brief (complete project context)
- `docs/planning/project-reference.md` (detailed specification)
- `docs/planning/tech-stack.md` (technology decisions)
- `docs/planning/video-strategy.md` (epic structure with 3 epics)

**Critical requirements:**
- 3 epics: Monorepo Foundation → Agent SDK Integration → React Chat UI
- ~10-13 stories total across all epics
- 200-250 LOC target for core framework
- Educational demo positioning (not production tool)
- Security warnings prominent throughout

Ask for clarification on any ambiguities, but the planning documents should provide comprehensive guidance for generating the PRD.

**Ready to proceed with `*create-prd` when you are!**

---

*Project Brief completed by Mary (Business Analyst) on 2025-11-14*

