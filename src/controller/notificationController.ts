import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
// import { notificationService } from '../utils/socketManager';
// import { NotificationService } from '../services/notificationService';
const prisma = new PrismaClient();
// const notificationService = new NotificationService();
// Create a new notification
export const createNotification = async (req: Request, res: Response) => {
    const { userId, studyId } = req.body;
    try {
        const notification = await prisma.notification.create({
            data: {
                userId,
                studyId,
                seen: false, // Default value
            },
        });
        const studyDetails = await prisma.studies.findUnique({
            where: { IdStudies: studyId },
        });

        if (!studyDetails) {
            return res.status(404).json({ message: 'Study not found' });
        }
        // await notificationService.notifyNewStudy(userId, studyDetails);
        res.status(201).json(notification);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create notification', error });
    }
};

// Get all notifications for a user
// Get all notifications for a user, including user details and study information
export const getUserNotifications = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        // Fetch notifications with related user and study details
        const notifications = await prisma.notification.findMany({
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
        const transformedNotifications = notifications.map(notification => ({
            ...notification,
            // user: {
            //     // Extract only necessary user fields if required
            //     name: notification?.user?.FullName||"it will be created",
            //     email: notification.user.Email,
            //     // Add any other user fields you want to include
            // },
            study: notification.study && {
                // ...notification.study,
                clientName: notification.study.client.ClientName,
                 Nature:notification.study.Nature,
                 TypeEtude:notification.study.TypeEtude
                // Add any other study fields you want to include
            },
        })); 

        res.json(notifications);
    } catch (error) {
        console.error('Error retrieving notifications:', error);
        res.status(500).json({ message: 'Failed to get notifications', error });
    }
};


// Update a notification to mark it as seen
export const updateNotification = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const notification = await prisma.notification.update({
            where: { id: parseInt(id) },
            data: { seen: true },
        });
        res.json(notification);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update notification', error });
    }
};

// Delete a notification
export const deleteNotification = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.notification.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete notification', error });
    }
};
