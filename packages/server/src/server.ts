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
import { ConversationHistory, ConversationMessage } from '@bmad-app/shared';

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
// Priority 1: /chat always serves from packages/client
const clientPath = path.join(__dirname, '../../client');
app.use('/chat', express.static(clientPath));
logger.info('Static files served from packages/client for /chat route');

// Static file serving for /public directory (Story 2.6)
// Priority 2: Root URL serves generated HTML/CSS/JS files
// WARNING: DO NOT create public/chat/ directory - it will conflict with /chat route above
const publicPath = path.join(process.cwd(), 'public');
app.use(express.static(publicPath, {
  index: ['index.html'], // Directory index: /pages/ automatically serves /pages/index.html
  extensions: ['html', 'htm'], // Extensionless URLs: /products serves products.html
}));
logger.info('Static files served from /public directory at root URL');

// Static file serving for /data directory (Story 2.4/2.5)
// Priority 3: /data URL serves JSON files for client-side fetch (optional pattern)
const dataPath = path.join(process.cwd(), 'data');
app.use('/data', express.static(dataPath));
logger.info('Static files served from /data directory at /data URL');

// Routes
app.use('/api/health', healthRouter);

// API: List generated HTML pages (for chat interface menu)
app.get('/api/pages', async (req, res) => {
  try {
    const publicPath = path.join(process.cwd(), 'public');
    const files = await import('fs/promises').then(fs => fs.readdir(publicPath, { recursive: true }));
    const htmlFiles = files.filter(f => typeof f === 'string' && f.endsWith('.html'));
    res.json({ files: htmlFiles });
  } catch (err) {
    res.json({ files: [] });
  }
});

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

// Story 2.7: Store conversation history per socket connection (session-based memory)
// Map structure: socket.id → array of conversation messages
const conversationHistories = new Map<string, ConversationHistory>();

// Socket.io connection handler
io.on('connection', (socket) => {
  // Story 2.7: Initialize empty conversation history for new connection
  conversationHistories.set(socket.id, []);
  logger.info('Socket connected, initialized conversation history', {
    component: 'SocketServer',
    socketId: socket.id,
  });

  // Listen for user_message event (Story 2.7 - With Conversation Memory)
  socket.on('user_message', async (payload: { content: string; messageId: string }) => {
    try {
      const { content, messageId } = payload;

      // Story 2.7: Get conversation history for this socket
      const history = conversationHistories.get(socket.id) || [];

      // Story 2.7: Append user message to history
      const userMessage: ConversationMessage = {
        role: 'user',
        content,
        timestamp: Date.now(),
      };
      history.push(userMessage);
      conversationHistories.set(socket.id, history);

      logger.debug('User message added to history', {
        component: 'SocketServer',
        socketId: socket.id,
        messageCount: history.length,
      });

      // Story 2.7: Call event loop with conversation history
      // Event loop returns assistant message for history append
      const assistantMessage = await handleUserMessage(content, messageId, socket, history);

      // Story 2.7: Append agent response to history
      if (assistantMessage) {
        history.push(assistantMessage);
        conversationHistories.set(socket.id, history);

        logger.debug('Agent response added to history', {
          component: 'SocketServer',
          socketId: socket.id,
          messageCount: history.length,
        });
      }
    } catch (error) {
      // Error already handled by event loop, logged here for server tracking
      logger.error('Failed to process user message', {
        component: 'SocketServer',
        error: (error as Error).message,
      });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    // Story 2.7: Clear conversation history to prevent memory leaks
    const history = conversationHistories.get(socket.id);
    const messageCount = history?.length || 0;

    conversationHistories.delete(socket.id);

    logger.info('Socket disconnected, cleared conversation history', {
      component: 'SocketServer',
      socketId: socket.id,
      messageCount,
    });
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
