"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = void 0;
const clientRoutes_1 = __importDefault(require("./clientRoutes"));
const notificationRoutes_1 = __importDefault(require("./notificationRoutes"));
const userRoutes_1 = __importDefault(require("./userRoutes"));
const studyRoutes_1 = __importDefault(require("./studyRoutes"));
const userStudyRoutes_1 = __importDefault(require("./userStudyRoutes"));
const fileRoutes_1 = __importDefault(require("./fileRoutes"));
const statsRoutes_1 = __importDefault(require("./statsRoutes"));
// Function to register all routes
const registerRoutes = (app) => {
    app.use('/clients', clientRoutes_1.default);
    app.use('/notifications', notificationRoutes_1.default);
    app.use('/users', userRoutes_1.default);
    app.use('/studies', studyRoutes_1.default);
    app.use('/userStudies', userStudyRoutes_1.default);
    app.use('/api', fileRoutes_1.default);
    app.use("/stats", statsRoutes_1.default);
    // Add more routes as needed
};
exports.registerRoutes = registerRoutes;
