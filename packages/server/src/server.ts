/**
 * Express server entry point
 *
 * Features:
 * - Express 5 HTTP server
 * - Health check endpoint
 * - CORS for Vite dev server (localhost:5173)
 * - Error handling middleware
 * - Structured logging
 */
import express, { Request, Response, NextFunction } from 'express';
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
});
