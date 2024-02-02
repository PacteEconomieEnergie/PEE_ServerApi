import express from 'express';
import {
    createNotification,
    getUserNotifications,
    updateNotification,
    deleteNotification,
} from '../controller/notificationController';

const router = express.Router();

// Route to create a new notification
router.post('/', createNotification);

// Route to get all notifications for a specific user
router.get('/:userId', getUserNotifications);

// Route to update a notification (mark as seen)
router.patch('/:id', updateNotification);

// Route to delete a notification
router.delete('/:id', deleteNotification);

export default router;
