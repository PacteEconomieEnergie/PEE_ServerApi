// src/services/NotificationService.ts
import { prisma } from "../utils/prismaClient";
import { Server } from "socket.io";
import { getIo, users } from "../utils/socketManager"; 
export class NotificationService {
  private get io() {
    return getIo(); // This will call getIo() only when io is accessed
  }

  constructor() {
   
  }

  public async notifyNewStudy(userId: number, study: any) {
    const socketId = users.get(userId);
    console.log("here it is");
    
    if (socketId) {
      console.log('Socket ID:');
    
      this.io.to(socketId).emit('newStudyCreated', {
        message: 'A new study has been created.',
        studyDetails: {
          id: study.IdStudies, // Assuming this is the ID field
          title: study.Title, // Example detail
          // Add other relevant study details here  
        },
      });  
    }else {
      // Create a notification record if the user is not online
      await this.createNotification(userId, study.IdStudies);
    }
  };
  public async sendUnseenNotifications(userId: number) {
    const notifications = await prisma.notification.findMany({
      where: { userId, seen: false },
      include: { study: true }
    });

    notifications.forEach(async (notification) => {
      if (notification.study) {
        const socketId = users.get(userId);
        if (socketId) {
          this.io.to(socketId).emit('newStudyNotification', { notificationId: notification.id, study: notification.study });
          await prisma.notification.update({
            where: { id: notification.id },
            data: { seen: true },
          });
        }
      }
    });
  }
  public async notifyStudyStatusUpdate(userId: number, study: any) {
    const socketId = users.get(userId);
    if (socketId) {
      // Emitting an event for study status update
      this.io.to(socketId).emit('studyStatusUpdated', {
        message: `The status of study ${study.IdStudies} has been updated.`,
        studyId: study.IdStudies,
        newStatus: study.Status,
        // Include any other relevant study details you want to send
      });
    }else {
      // Create a notification record if the user is not online
      await this.createNotification(userId, study.IdStudies);
    }
  }
  public removeUser(socketId: string) {
    for (let [userId, userSocketId] of users.entries()) {
      if (socketId === userSocketId) {
        users.delete(userId);
        console.log(`Removed user ${userId} from users map.`);
        break;
      }
    }
  }
  public async createNotification(userId: number, studyId: number) {
    return prisma.notification.create({
      data: {
        userId,
        studyId,
        seen: false, // Default value
      },
    });
  }

  public async getNotificationsForUser(userId: number) {
    return prisma.notification.findMany({
      where: { userId },
      include: {
        study: true, // Adjust according to your actual relations
      },
    });
  }

  public async markNotificationAsSeen(id: number) {
    return prisma.notification.update({
      where: { id },
      data: { seen: true },
    });
  }

  public async deleteNotification(id: number) {
    return prisma.notification.delete({
      where: { id },
    });
  }
}
