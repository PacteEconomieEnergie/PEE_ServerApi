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
exports.deleteNotification = exports.updateNotification = exports.getUserNotifications = exports.createNotification = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Create a new notification
const createNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, studyId } = req.body;
    try {
        const notification = yield prisma.notification.create({
            data: {
                userId,
                studyId,
                seen: false, // Default value
            },
        });
        res.status(201).json(notification);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to create notification', error });
    }
});
exports.createNotification = createNotification;
// Get all notifications for a user
// Get all notifications for a user, including user details and study information
const getUserNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { userId } = req.params;
    try {
        // Fetch notifications with related user and study details
        const notifications = yield prisma.notification.findMany({
            where: { userId: parseInt(userId) },
            include: {
                // Assuming the relation is correctly set up
                study: {
                    include: {
                        client: {
                            select: {
                                ClientName: true,
                            }
                        }, // Include client details of the study
                        files: {
                            select: {
                                idFiles: true,
                                // Add any other file fields you need
                            }
                        }, // Include files related to the study
                        // Include any other relations you need
                    },
                },
            },
        });
        // Transform notifications to include only necessary details or to format the data
        const transformedNotifications = notifications.map(notification => (Object.assign(Object.assign({}, notification), { 
            // user: {
            //     // Extract only necessary user fields if required
            //     name: notification?.user?.FullName||"it will be created",
            //     email: notification.user.Email,
            //     // Add any other user fields you want to include
            // },
            study: notification.study && {
                // ...notification.study,
                clientName: notification.study.client.ClientName,
                Nature: notification.study.Nature,
                TypeEtude: notification.study.TypeEtude
                // Add any other study fields you want to include
            } })));
        console.log((_a = notifications[0].study) === null || _a === void 0 ? void 0 : _a.client);
        res.json(notifications);
    }
    catch (error) {
        console.error('Error retrieving notifications:', error);
        res.status(500).json({ message: 'Failed to get notifications', error });
    }
});
exports.getUserNotifications = getUserNotifications;
// Update a notification to mark it as seen
const updateNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const notification = yield prisma.notification.update({
            where: { id: parseInt(id) },
            data: { seen: true },
        });
        res.json(notification);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to update notification', error });
    }
});
exports.updateNotification = updateNotification;
// Delete a notification
const deleteNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.notification.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to delete notification', error });
    }
});
exports.deleteNotification = deleteNotification;
