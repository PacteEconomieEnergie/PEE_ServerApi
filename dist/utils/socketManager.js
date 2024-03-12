"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocketIO = exports.io = exports.users = void 0;
const socket_io_1 = require("socket.io");
const jwt_decode_1 = require("jwt-decode"); // Adjust import based on your setup
const NotificationService_1 = require("../services/NotificationService");
// const prisma = new PrismaClient();
exports.users = new Map(); // Maps userId to socketId
const setupSocketIO = (httpServer) => {
    exports.io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: "*", // Specify allowed origins
            methods: ["GET", "POST"],
            credentials: true,
        },
    });
    const notificationService = new NotificationService_1.NotificationService(exports.io, exports.users);
    exports.io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id}`);
        socket.on('authenticate', (token) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const decoded = (0, jwt_decode_1.jwtDecode)(token);
                const userId = decoded.userId;
                if (userId) {
                    exports.users.set(userId.toString(), socket.id);
                    // Fetch unseen notifications logic here
                    yield notificationService.sendUnseenNotifications(userId);
                }
            }
            catch (error) {
                console.error('Error in socket authentication:', error);
            }
        }));
        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`);
            notificationService.removeUser(socket.id);
        });
    });
};
exports.setupSocketIO = setupSocketIO;
exports.default = exports.setupSocketIO;
