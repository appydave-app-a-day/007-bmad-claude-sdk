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
import { handleUserMessage } from './agent/event-loop.js';

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

// Socket.io connection handler
io.on('connection', (socket) => {
  logger.info('Client connected', { component: 'SocketServer', socketId: socket.id });

  // Listen for user_message event (Story 2.2 - Agent Event Loop Integration)
  socket.on('user_message', async (payload: { content: string; messageId: string }) => {
    try {
      const { content, messageId } = payload;

      // Process message through event loop
      const response = await handleUserMessage(content, messageId);

      // Emit complete response (no streaming yet - Story 2.3 will add streaming)
      socket.emit('agent_response', {
        content: response,
        messageId,
      });

      logger.info('Sent response to client', {
        component: 'SocketServer',
        messageId,
        responseLength: response.length,
      });
    } catch (error) {
      // Emit error event to client
      const errorMessage = (error as Error).message || 'Agent processing failed';
      socket.emit('error', {
        message: errorMessage,
        code: 'AGENT_ERROR',
      });

      logger.error('Failed to process user message', {
        component: 'SocketServer',
        error: errorMessage,
      });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    logger.info('Client disconnected', { component: 'SocketServer', socketId: socket.id });
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
