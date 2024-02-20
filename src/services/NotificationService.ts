// src/services/NotificationService.ts
import { prisma } from "../utils/prismaClient";
import { Server } from "socket.io";

export class NotificationService {
  private io: Server;
  private users: Map<string, string>;

  constructor(io: Server, users: Map<string, string>) {
    this.io = io;
    this.users = users;
  }

  public async notifyNewStudy(userId: string, study: any) {
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
  };
  public async sendUnseenNotifications(userId: number) {
    const notifications = await prisma.notification.findMany({
      where: { userId, seen: false },
      include: { study: true }
    });

    notifications.forEach(async (notification) => {
      if (notification.study) {
        const socketId = this.users.get(userId.toString());
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
  public async notifyStudyStatusUpdate(userId: string, study: any) {
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
  }
  public removeUser(socketId: string) {
    for (let [userId, userSocketId] of this.users.entries()) {
      if (socketId === userSocketId) {
        this.users.delete(userId);
        console.log(`Removed user ${userId} from users map.`);
        break;
      }
    }
  }
}
