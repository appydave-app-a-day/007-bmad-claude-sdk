/**
 * Express server entry point
 *
 * Features:
 * - Express 5 HTTP server
 * - Socket.io for real-time bidirectional communication
 * - Health check endpoint
 * - Static file serving for test client
 * - CORS for Vite dev server (localhost:5173)
 * - Error handling middleware
 * - Structured logging
 */
import express, { Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { healthRouter } from './routes/health';
import { ToolError } from './utils/errors';
import { logger } from './utils/logger';
import { initializeAgent } from './agent/agent-config.js';

const app = express();
const PORT = process.env.PORT || 3000;
const httpServer = createServer(app); // Wrap Express app with HTTP server for Socket.io

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

// Initialize Socket.io server with CORS (AC 2)
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173', // Allow Vite dev server (Epic 3)
    methods: ['GET', 'POST'],
  },
});

// Socket.io connection handler (AC 7)
io.on('connection', (socket) => {
  logger.info('Socket connected', { id: socket.id });

  // Listen for test_message event (AC 4, 5)
  socket.on('test_message', (data) => {
    logger.info('Received test_message', { data });

    // Echo back to client with timestamp
    socket.emit('test_response', {
      message: `Server received: "${data.message}"`,
      timestamp: Date.now(),
    });
  });

  // Handle disconnection (AC 7)
  socket.on('disconnect', () => {
    logger.info('Socket disconnected', { id: socket.id });
  });
});

// Initialize Agent SDK and start server (Story 2.1)
const startServer = async () => {
  try {
    // Initialize Agent SDK (Story 2.1)
    await initializeAgent();

    // Start HTTP server
    httpServer.listen(PORT, () => {
      logger.info(`Server started on port ${PORT}`);
      logger.info(`Health check: http://localhost:${PORT}/api/health`);
      logger.info(`Test client: http://localhost:${PORT}/chat`);
    });
  } catch (error) {
    logger.error('Failed to start server', {
      component: 'Express',
      error: (error as Error).message,
    });
    process.exit(1);
  }
};

startServer();
