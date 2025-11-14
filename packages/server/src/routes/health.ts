/**
 * Health check endpoint
 *
 * GET /api/health
 * Returns: { status: 'ok' }
 *
 * Purpose: Verify server is running and responding to HTTP requests
 */
import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/', (req, res) => {
  res.json({ status: 'ok' });
});
