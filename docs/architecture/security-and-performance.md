# Security and Performance

## Security Requirements

**⚠️ CRITICAL: This is an EDUCATIONAL DEMO - NOT production-ready**

**Frontend Security:**
- **CSP Headers:** None for MVP (future: strict Content-Security-Policy)
- **XSS Prevention:** React's built-in escaping (JSX auto-escapes user input)
- **Secure Storage:** localStorage for theme only (no sensitive data)

**Backend Security:**
- **Input Validation:** Path sandboxing only (validates file paths within allowed directories)
- **Rate Limiting:** None for MVP (single-user localhost assumption)
- **CORS Policy:** Allow localhost:5173 (Vite dev server) only

**Authentication Security:**
- **Token Storage:** Claude CLI manages tokens in `~/.claude/` (not in application)
- **Session Management:** None (no user sessions for MVP)
- **Password Policy:** N/A (no user authentication)

**Path Sandboxing Implementation:**

```typescript
// Only allow writes to /data and /public
const validatePath = (filepath: string, allowedDir: string): string => {
  const resolved = path.resolve(allowedDir, filepath);
  if (!resolved.startsWith(path.resolve(allowedDir))) {
    throw new ToolError('Path traversal blocked');
  }
  return resolved;
};
```

**Security Warnings in Documentation:**
- Prominent warning in README.md
- No production deployment instructions in MVP
- Clear educational-only positioning

## Performance Optimization

**Frontend Performance:**
- **Bundle Size Target:** < 500KB total (React + Socket.io client + shadcn components)
- **Loading Strategy:** Code splitting via dynamic imports (future optimization)
- **Caching Strategy:** Browser caching for static assets (Cache-Control headers)

**Backend Performance:**
- **Response Time Target:** < 5 seconds first agent response (cold start), < 2 seconds subsequent
- **Database Optimization:** N/A (file-based storage, linear O(n) acceptable for demo data)
- **Caching Strategy:** None for MVP (agent responses non-cacheable, conversational context)

**Performance Not Optimized in MVP:**
- No CDN for static assets
- No image optimization
- No lazy loading for components
- No service workers or offline support

---
