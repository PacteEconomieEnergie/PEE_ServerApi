import { setupGlobalMiddleware } from './middleware/index';
import { registerRoutes } from './routes';
import express from 'express';
import { createServer } from 'http';
import setupSocketIO from './utils/socketManager';
import config from './config/envConfig'; // Assuming this contains your port and other configurations
import { errorHandler } from './middleware/errorHandler';
const app = express();

// Apply all global middleware to the app
setupGlobalMiddleware(app);

// Register all routes with the app
registerRoutes(app);

// Apply the enhanced global error handler middleware
app.use(errorHandler);

const httpServer = createServer(app);

// Set up Socket.IO and integrate it with the HTTP server
setupSocketIO(httpServer);

// Start the server
httpServer.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
      