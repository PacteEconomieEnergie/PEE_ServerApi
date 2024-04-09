"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const routes_1 = require("./routes");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const socketManager_1 = __importDefault(require("./utils/socketManager"));
const errorHandler_1 = require("./middleware/errorHandler");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: "*", // Be more specific in a production environment
    credentials: true,
}));
// Apply all global middleware to the app
// setupGlobalMiddleware(app);
// Register all routes with the app
(0, routes_1.registerRoutes)(app);
// Apply the enhanced global error handler middleware
app.use(errorHandler_1.errorHandler);
const httpServer = (0, http_1.createServer)(app);
// Set up Socket.IO and integrate it with the HTTP server
(0, socketManager_1.default)(httpServer);
// Start the server
httpServer.listen(3002, () => {
    console.log(`Server running on port 3002`);
});
