# Requirements

## Functional Requirements

**FR1:** The application shall provide a chat interface where users can type natural language instructions to generate/modify application features

**FR2:** The system shall implement exactly three domain-agnostic tools: `read_json` (read data files), `write_json` (write/update data files), `write_file` (create/update HTML/CSS/JS files)

**FR3:** The application shall enforce path sandboxing, restricting file operations to only `/data` and `/public` directories

**FR4:** The application shall use Socket.io to stream Claude Agent SDK responses in real-time to the chat interface

**FR5:** The system shall support monorepo structure with separate workspaces for server, client, and shared code

**FR6:** The application shall display streaming responses with proper formatting (markdown support, code blocks, etc.)

**FR7:** The Agent SDK event loop implementation shall be built incrementally, remaining minimal and conceptually simple to demonstrate the core SDK pattern

**FR8:** The Express server shall serve generated HTML/CSS/JS files from `/public` directory at appropriate routes (e.g., `/` for homepage, `/products` for product list)

**FR9:** The chat interface shall be accessible at `/chat` route

**FR10:** The application shall support light mode and dark mode toggle for the chat interface

## Non-Functional Requirements

**NFR1:** The Agent SDK event loop implementation shall be kept minimal to maintain educational clarity - complexity should only be added when necessary

**NFR2:** The application shall use Claude Pro/Team OAuth authentication via `claude auth login` (no API key management required)

**NFR3:** The system shall provide clear console logging showing Agent SDK event loop execution for educational transparency

**NFR4:** The codebase shall include comprehensive inline comments explaining Agent SDK integration patterns for learning purposes

**NFR5:** The application shall work on developer machines with Node.js 18+ without requiring cloud deployment

**NFR6:** The chat interface shall be responsive and work on desktop browsers (mobile optimization not required for MVP)

**NFR7:** All dependencies shall use stable releases (no experimental or beta packages) to ensure reproducibility
