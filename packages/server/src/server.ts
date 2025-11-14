/**
 * Express server entry point
 *
 * Features:
 * - Express 5 HTTP server
 * - Health check endpoint
 * - Static file serving for test client
 * - CORS for Vite dev server (localhost:5173)
 * - Error handling middleware
 * - Structured logging
 */
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { healthRouter } from './routes/health';
import { ToolError } from './utils/errors';
import { logger } from './utils/logger';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware: Parse JSON request bodies
app.use(express.json());

// Middleware: CORS for Vite dev server
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// Static file serving for /chat route (Story 1.3)
// Serves index.html from packages/client directory
const clientPath = path.join(__dirname, '../../client');
app.use('/chat', express.static(clientPath));
logger.info('Static files served from packages/client for /chat route');

// Routes
app.use('/api/health', healthRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Request error', {
    error: err.message,
    path: req.path,
  });

  if (err instanceof ToolError) {
    return res.status(400).json({
      error: err.message,
      code: err.code,
    });
  }

  res.status(500).json({
    error: 'Internal server error',
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
  logger.info(`Health check: http://localhost:${PORT}/api/health`);
  logger.info(`Test client: http://localhost:${PORT}/chat`);
});
