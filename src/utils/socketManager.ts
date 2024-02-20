import { Server } from "socket.io";
import  { JwtPayload,jwtDecode  } from "jwt-decode"// Adjust import based on your setup
import { NotificationService } from '../services/NotificationService';


interface CustomJwtPayload extends JwtPayload {
    userId?: number; // Adjust the type as per your token structure
    // Add other custom fields from the token if needed
  }
// const prisma = new PrismaClient();
export const users = new Map<string, string>(); // Maps userId to socketId

export let io: Server;

export const setupSocketIO = (httpServer: any) => {
     io = new Server(httpServer, {
      cors: {
        origin: "*", // Specify allowed origins
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    const notificationService = new NotificationService(io, users);


    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id}`);

        socket.on('authenticate', async (token: string) => {
            try {
                const decoded= jwtDecode<CustomJwtPayload>(token);
                const userId = decoded.userId;
                if (userId) {
                    users.set(userId.toString(), socket.id);
                    // Fetch unseen notifications logic here
                    await notificationService.sendUnseenNotifications(userId)
                }
            } catch (error) {
                console.error('Error in socket authentication:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`);
            notificationService.removeUser(socket.id);
        });
    });


}


export default setupSocketIO;