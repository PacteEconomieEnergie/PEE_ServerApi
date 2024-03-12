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
exports.NotificationService = void 0;
// src/services/NotificationService.ts
const prismaClient_1 = require("../utils/prismaClient");
class NotificationService {
    constructor(io, users) {
        this.io = io;
        this.users = users;
    }
    notifyNewStudy(userId, study) {
        return __awaiter(this, void 0, void 0, function* () {
            const socketId = this.users.get(userId);
            if (socketId) {
                this.io.to(socketId).emit('newStudyCreated', {
                    message: 'A new study has been created.',
                    studyDetails: {
                        id: study.IdStudies, // Assuming this is the ID field
                        title: study.Title, // Example detail
                        // Add other relevant study details here
                    },
                });
            }
        });
    }
    ;
    sendUnseenNotifications(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const notifications = yield prismaClient_1.prisma.notification.findMany({
                where: { userId, seen: false },
                include: { study: true }
            });
            notifications.forEach((notification) => __awaiter(this, void 0, void 0, function* () {
                if (notification.study) {
                    const socketId = this.users.get(userId.toString());
                    if (socketId) {
                        this.io.to(socketId).emit('newStudyNotification', { notificationId: notification.id, study: notification.study });
                        yield prismaClient_1.prisma.notification.update({
                            where: { id: notification.id },
                            data: { seen: true },
                        });
                    }
                }
            }));
        });
    }
    notifyStudyStatusUpdate(userId, study) {
        return __awaiter(this, void 0, void 0, function* () {
            const socketId = this.users.get(userId);
            if (socketId) {
                // Emitting an event for study status update
                this.io.to(socketId).emit('studyStatusUpdated', {
                    message: `The status of study ${study.IdStudies} has been updated.`,
                    studyId: study.IdStudies,
                    newStatus: study.Status,
                    // Include any other relevant study details you want to send
                });
            }
        });
    }
    removeUser(socketId) {
        for (let [userId, userSocketId] of this.users.entries()) {
            if (socketId === userSocketId) {
                this.users.delete(userId);
                console.log(`Removed user ${userId} from users map.`);
                break;
            }
        }
    }
}
exports.NotificationService = NotificationService;
