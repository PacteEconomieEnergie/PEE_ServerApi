"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notificationController_1 = require("../controller/notificationController");
const router = express_1.default.Router();
// Route to create a new notification
router.post('/', notificationController_1.createNotification);
// Route to get all notifications for a specific user
router.get('/:userId', notificationController_1.getUserNotifications);
// Route to update a notification (mark as seen)
router.patch('/:id', notificationController_1.updateNotification);
// Route to delete a notification
router.delete('/:id', notificationController_1.deleteNotification);
exports.default = router;
