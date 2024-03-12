import { setupGlobalMiddleware } from './middleware/index';
import { registerRoutes } from './routes';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { initIo } from './utils/socketManager';
import config from './config/envConfig'; // Assuming this contains your port and other configurations
import { errorHandler } from './middleware/errorHandler';
import userRoutes from './routes/userRoutes';
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: "*", // Be more specific in a production environment
  credentials: true,
}));
// Apply all global middleware to the app
// setupGlobalMiddleware(app);

// Register all routes with the app
registerRoutes(app);

// Apply the enhanced global error handler middleware
app.use(errorHandler);

const httpServer = createServer(app);

// Set up Socket.IO and integrate it with the HTTP server
initIo(httpServer);

// Start the server
httpServer.listen(3002, () => {
  console.log(`Server running on port 3002`);


});
      