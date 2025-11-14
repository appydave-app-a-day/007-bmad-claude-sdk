# Monitoring and Observability

## Monitoring Stack

- **Frontend Monitoring:** Browser console logging (no external service)
- **Backend Monitoring:** Structured console logs with `logger.ts` utility
- **Error Tracking:** Console only (future: Sentry for production deployments)
- **Performance Monitoring:** Manual observation (future: performance.now() metrics)

## Key Metrics

**Frontend Metrics (Observed Manually):**
- Page load time (browser DevTools)
- WebSocket connection stability (console logs)
- React render performance (React DevTools)
- User interaction responsiveness (manual testing)

**Backend Metrics (Logged to Console):**
- Agent response time (logged by event loop)
- Tool execution duration (logged by each tool)
- Socket.io connection count (logged by socket manager)
- File operation success/failure rate (logged by tools)

**Logging Example:**

```typescript
// Structured logging format
logger.info('Agent response complete', {
  component: 'AgentEventLoop',
  messageId: 'msg_123',
  duration: 3542,  // milliseconds
  toolsCalled: ['read_json', 'write_file'],
  chunkCount: 15
});
```

---
