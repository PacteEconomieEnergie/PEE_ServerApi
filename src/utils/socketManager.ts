import { Server as SocketIOServer, Socket } from "socket.io";
import  { JwtPayload,jwtDecode  } from "jwt-decode"// Adjust import based on your setup
// import { NotificationService } from '../services/NotificationService';
import { prisma } from "./prismaClient";
import { Server as HTTPServer } from 'http';
interface CustomJwtPayload extends JwtPayload {
    userId?: number; // Adjust the type as per your token structure
    // Add other custom fields from the token if needed
  }
  let io: SocketIOServer | null = null;
  export const users = new Map<number, string>();
  
  export const initIo = (httpServer: HTTPServer) => {
    if (!io) {
      io = new SocketIOServer(httpServer, {
        cors: {
          origin: "*", // Adjust in production
          methods: ["GET", "POST"],
          credentials: true,
        },
      });
  
      io.on('connection', (socket) => {
        console.log(`New socket connection: ${socket.id}`);
  
        socket.on('authenticate', async (token: string) => {
          try {
            const decoded = jwtDecode<CustomJwtPayload>(token);
            const userId = decoded.userId;
            if (userId) {
              console.log(`Socket connected: ${socket.id} with user ID: ${userId}`);
              users.set(userId, socket.id);
  
              // Efficiently fetching and emitting notifications
              const notifications = await prisma.notification.findMany({
                where: { userId: userId, seen: false },
                include: { study: true },
              });
  
              notifications.forEach((notification) => {
                if (notification.study) {
                  socket.emit('newStudyCreated', {
                    notificationId: notification.id,
                    study: notification.study,
                  });
  
                  prisma.notification.update({
                    where: { id: notification.id },
                    data: { seen: true },
                  }).catch(console.error);
                }
              });
            }
          } catch (error) {
            console.error('Error in socket authentication:', error);
          }
        });
  
        socket.on('disconnect', () => {
          console.log(`Socket disconnected: ${socket.id}`);
          users.forEach((socketId, userId) => {
            if (socketId === socket.id) {
              users.delete(userId);
              console.log(`Removed user ${userId} from users map.`);
            }
          });
        });
      });
  
      console.log("Socket.IO initialized.");
    }
  };
  
  export const getIo = () => {
    if (!io) {
      throw new Error("Socket.IO is not initialized.");
    }
    return io;
  };
// const prisma = new PrismaClient();
// export const users = new Map<string, string>(); // Maps userId to socketId


// export let notificationService: NotificationService;
// export const setupSocketIO = (httpServer: any) => {
//      io = new Server(httpServer, {
//       cors: {
//         origin: "*", // Specify allowed origins
//         methods: ["GET", "POST"],
//         credentials: true,
//       },
//     });

//      notificationService = new NotificationService(io, users);


//     io.on('connection', (socket) => {
        

//         socket.on('authenticate', async (token: string) => {
//             try {
//                 const decoded= jwtDecode<CustomJwtPayload>(token);
//                 const userId = decoded.userId;
//                 console.log(`Socket connected: ${socket.id} with user ID: ${userId}`);
//                 if (userId) {
//                     users.set(userId.toString(), socket.id);
//                     // Fetch unseen notifications logic here
//                     await notificationService.sendUnseenNotifications(userId)
//                 }
//             } catch (error) {
//                 console.error('Error in socket authentication:', error);
//             }
//         });

//         socket.on('disconnect', () => {
//             console.log(`Socket disconnected: ${socket.id}`);
//             notificationService.removeUser(socket.id);
//         });
//     });


// }


// export default setupSocketIO;
// export let io: Server;
// export const users = new Map<number, string>(); // Maps userId to socketId for direct access

// export function setupSocketIO(server: any) {
//     const io = new Server(server, {
//         cors: {
//             origin: "*", // Specify allowed origins
//             methods: ["GET", "POST"],
//             credentials: true,
//         },
//     });

//     io.on('connection', (socket) => {
        

//         socket.on('authenticate', async (token: string) => {
//             try {
//                 const decoded = jwtDecode<CustomJwtPayload>(token);
//                 const userId = decoded.userId;
//                 console.log(`Socket connected: ${socket.id} with user ID: ${userId}`);
//                 if (userId) {
//                     users.set(userId, socket.id); // Use numeric userId for direct mapping

//                     // Efficiently fetching and emitting notifications
//                     const notifications = await prisma.notification.findMany({
//                         where: {
//                             userId: userId,
//                             seen: false,
//                         },
//                         include: {
//                             study: true, // Assuming this relation is correctly defined
//                         },
//                     });

//                     notifications.forEach(async (notification) => {
//                         if (notification.study) {
//                             socket.emit('newStudyCreated', {
//                                 notificationId: notification.id,
//                                 study: notification.study,
//                             });
//                             await prisma.notification.update({
//                                 where: { id: notification.id },
//                                 data: { seen: true },
//                             });
//                         }
//                     });
//                 }
//             } catch (error) {
//                 console.error('Error in socket authentication:', error);
//             }
//         });

//         socket.on('disconnect', () => {
//             console.log(`Socket disconnected: ${socket.id}`);
//             users.forEach((socketId, userId) => {
//                 if (socketId === socket.id) {
//                     users.delete(userId);
//                     console.log(`Removed user ${userId} from users map.`);
//                 }
//             });
//         });
//     });

//     // Optional: Export the io instance if you need to use it outside this module
//     return { io, users }
// }