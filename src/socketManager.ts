import { Server } from "socket.io";
import  { JwtPayload,jwtDecode  } from "jwt-decode"// Adjust import based on your setup
import { PrismaClient,Prisma,Notification } from "@prisma/client";




interface CustomJwtPayload extends JwtPayload {
    userId?: number; // Adjust the type as per your token structure
    // Add other custom fields from the token if needed
  }
const prisma = new PrismaClient();
const users = new Map<string, string>(); // Maps userId to socketId

export function setupSocketIO(server: any) {
    const io = new Server(server, {
        cors: {
            origin: "*", // Specify allowed origins
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id}`);

        socket.on('authenticate', async (token: string) => {
            try {
                const decoded= jwtDecode<CustomJwtPayload>(token);
                const userId = decoded.userId;
                if (userId) {
                    users.set(userId.toString(), socket.id);
                    // Fetch unseen notifications logic here
                    const notifications = await prisma.notification.findMany({
                        where: {
                            userId: decoded.userId,
                            seen: false,
                        },
                        include:{
                            study:true
                        }
                    });
        
                    notifications.forEach(async (notification) => {
                        if (notification.study) {
                            // Emit the notification along with the full study object
                            socket.emit('newStudyNotification', { notificationId: notification.id, study: notification.study });
                            // Optionally mark the notification as seen
                            await prisma.notification.update({
                                where: { id: notification.id },
                                data: { seen: true },
                            });
                        }
                    });
                }
            } catch (error) {
                console.error('Error in socket authentication:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`);
            // Iterate over the users map to find and remove the disconnected socketId
            for (let [userId, socketId] of users.entries()) {
                if (socketId === socket.id) {
                    users.delete(userId);
                    console.log(`Removed user ${userId} from users map.`);
                    break; // Exit the loop once the user is found and removed
                }
            }
        });
    });

    return { io, users };
}
