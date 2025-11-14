# Database Schema

**Important:** This application uses **JSON files** stored in the `/data` directory rather than a traditional database. This section documents the file-based storage approach.

## Storage Architecture

**Storage Type:** File System (JSON Files)
**Location:** `/data` directory (relative to project root)
**Format:** JSON files with `.json` extension
**Access:** Node.js `fs/promises` API with async operations

**Rationale:**
- **Educational simplicity** - No database setup, connection strings, or migrations
- **Transparency** - Files visible in filesystem, easy to inspect and debug
- **Zero configuration** - Works immediately on any Node.js environment
- **Version control friendly** - JSON files can be committed to git for demo data
- **Sufficient for MVP** - Demo data volumes (< 100 items) don't require database performance

## File Structure Examples

Since this is a **domain-agnostic framework**, the schema is defined by user conversation, not predetermined. Below are examples from the demo sequence:

**Example 1: Product Catalog (`/data/products.json`)**

```json
[
  {
    "id": "prod_001",
    "name": "Wireless Headphones",
    "price": 79.99,
    "description": "Premium noise-cancelling headphones",
    "category": "Audio",
    "inStock": true,
    "imageUrl": "/images/headphones.jpg"
  },
  {
    "id": "prod_002",
    "name": "Mechanical Keyboard",
    "price": 129.99,
    "description": "RGB backlit gaming keyboard",
    "category": "Peripherals",
    "inStock": true,
    "imageUrl": "/images/keyboard.jpg"
  },
  {
    "id": "prod_003",
    "name": "4K Webcam",
    "price": 199.99,
    "description": "Ultra HD webcam for streaming",
    "category": "Video",
    "inStock": false,
    "imageUrl": "/images/webcam.jpg"
  }
]
```

**Example 2: Blog Posts (`/data/blog-posts.json`)**

```json
[
  {
    "id": "post_001",
    "title": "Getting Started with Claude Agent SDK",
    "slug": "getting-started-claude-sdk",
    "content": "Full blog post content here...",
    "excerpt": "Learn how to build self-editing applications...",
    "author": "David Cruwys",
    "publishedAt": "2025-11-14T10:00:00Z",
    "tags": ["AI", "Agent SDK", "Tutorial"],
    "featured": true
  }
]
```

**Example 3: Application Config (`/data/config.json`)**

```json
{
  "siteName": "My Generated App",
  "theme": {
    "primaryColor": "#3b82f6",
    "fontFamily": "Inter, sans-serif"
  },
  "navigation": [
    {"label": "Home", "href": "/"},
    {"label": "Products", "href": "/products"},
    {"label": "Blog", "href": "/blog"}
  ],
  "socialLinks": {
    "twitter": "https://twitter.com/example",
    "github": "https://github.com/example"
  }
}
```

## File Organization Conventions

**Directory Structure:**

```
/data/
├── products.json           # Product catalog (if created via conversation)
├── blog-posts.json         # Blog posts (if created)
├── config.json             # Application config (if created)
├── users.json              # User data (example, not in MVP)
└── [any-filename].json     # User-defined schemas
```

**Conventions:**
- **Kebab-case filenames** - `blog-posts.json`, not `BlogPosts.json`
- **Array for collections** - `[{...}, {...}]` for lists of items
- **Object for singletons** - `{...}` for config files
- **UUID or string IDs** - `"id": "prod_001"` for item identification
- **ISO 8601 timestamps** - `"2025-11-14T10:00:00Z"` for dates

## No Schema Validation (By Design)

**Important Design Decision:** The framework does **NOT** enforce schemas. This is intentional:

**Why No Validation:**
- **Maximum flexibility** - Agent can create any JSON structure through conversation
- **Educational focus** - Demonstrates tool design, not data modeling
- **User-driven schemas** - Structure emerges from conversation, not predefined
- **Minimal code** - Validation adds complexity beyond 200 LOC target

**Trade-offs:**
- ⚠️ **Risk of invalid data** - Agent could create malformed JSON (mitigated by Claude's structured output capabilities)
- ⚠️ **No referential integrity** - No foreign key enforcement between files
- ⚠️ **No type safety at runtime** - TypeScript types exist but not enforced on file contents

**Future Enhancement (Post-MVP):**
- Add optional JSON Schema validation via tool parameter
- Implement schema registry in `/data/schemas/`
- Create validation tool: `validate_json(filepath, schemaPath)`

## Indexing and Performance

**MVP Approach:** No indexing (simple array iteration in generated HTML/JS)

**Performance Characteristics:**
- **Read operations** - O(n) file read + JSON parse (acceptable for < 100 items)
- **Write operations** - O(n) full file rewrite (no partial updates)
- **Search** - O(n) linear scan in generated JavaScript (client-side filtering)

**Future Optimization (If Needed):**
- Migrate to SQLite for larger datasets (100+ items)
- Add indexing for common queries (by ID, by category, etc.)
- Implement incremental writes (append-only logs, compaction)

## Backup and Version Control

**MVP Approach:**
- **No automatic backups** - User responsible for data safety
- **Git-friendly** - JSON files can be committed for demo data versioning
- **Manual backup** - User can copy `/data` folder

**Security Warning:**
⚠️ **Educational demo only** - Not production-ready. No data validation, authentication, or encryption.

---
