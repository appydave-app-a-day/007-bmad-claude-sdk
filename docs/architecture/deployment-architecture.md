# Deployment Architecture

**MVP Deployment Strategy:** Localhost only (no cloud deployment)

## Deployment Strategy

**Frontend Deployment:**
- **Platform:** Localhost only for MVP (served by Express in production mode)
- **Build Command:** `npm run build:client` (Vite production build)
- **Output Directory:** `packages/client/dist/`
- **CDN/Edge:** None (static files served directly by Express)

**Backend Deployment:**
- **Platform:** Localhost only for MVP (Node.js process)
- **Build Command:** `npm run build:server` (TypeScript compilation)
- **Deployment Method:** Direct Node.js execution (`node dist/server.js`)

**Production Start (Localhost):**

```bash