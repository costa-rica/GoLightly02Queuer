import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { sequelize } from './modules/database';

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['PORT', 'NAME_APP', 'PATH_TO_LOGS'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Error: Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

// Test database connection and sync
async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Sync database to ensure all tables exist
    await sequelize.sync({ alter: false });
    console.log('Database tables verified.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
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

// Start server
async function startServer() {
  // Initialize database first
  await initializeDatabase();

  // Start Express server
  app.listen(PORT, () => {
    console.log(`${process.env.NAME_APP} running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  });
}

// Initialize server
startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

export default app;
