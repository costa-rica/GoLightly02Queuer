import dotenv from 'dotenv';
import express, { Request, Response } from 'express';

// Load environment variables first
dotenv.config();

// Import logger after dotenv (logger validates env vars)
import logger from './modules/logger';
import { sequelize } from './modules/database';
import { errorHandler, notFoundHandler } from './modules/errorHandler';
import mantrasRouter from './routes/mantras';

// Test database connection and sync
async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    logger.info('Database connection has been established successfully');

    // Sync database to ensure all tables exist
    await sequelize.sync({ alter: false });
    logger.info('Database tables verified');
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    // Implement async IIFE pattern for early exit
    await new Promise((resolve) => setTimeout(resolve, 100));
    process.exit(1);
  }
}

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Placeholder route
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Mantrify01Queuer API',
    status: 'running',
    version: '1.0.0'
  });
});

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// API Routes
app.use('/mantras', mantrasRouter);

// 404 handler for undefined routes
app.use(notFoundHandler);

// Error handler middleware (must be last)
app.use(errorHandler);

// Start server
async function startServer() {
  try {
    // Initialize database first
    await initializeDatabase();

    // Start Express server
    app.listen(PORT, () => {
      logger.info(`${process.env.NAME_APP} running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    // Implement async IIFE pattern for early exit
    await new Promise((resolve) => setTimeout(resolve, 100));
    process.exit(1);
  }
}

// Initialize server using async IIFE pattern
(async () => {
  await startServer();
})();

export default app;
