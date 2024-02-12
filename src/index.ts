// const express = require('express');
// const { createServer } = require('http');
// const { Server } = require('socket.io');
// const cors = require('cors');
// import  { JwtPayload,jwtDecode  } from "jwt-decode"
// import { PrismaClient, Prisma } from '@prisma/client';
// import clientRoutes from "./src/routes/clientRoutes"

// interface CustomJwtPayload extends JwtPayload {
//   userId?: number; // Adjust the type as per your token structure
//   // Add other custom fields from the token if needed
// }
// const userRoutes=require('./src/routes/userRoutes.ts')
// const studyRoutes =require('./src/routes/studyRoutes.ts')

// const  userStudiesRoutes =require( "./src/routes/userStudyRoutes.ts")

// const corsOptions = {
//     origin: "*", // Change this to your allowed origins
//     methods: ["GET", "POST"], // Adjust the methods as needed
//     credentials: true,
//   };


// const prisma= new PrismaClient()
// const app = express();
// const server = createServer(app);  
// const io = new Server(server, {
//     cors: corsOptions, // Apply CORS options to Socket.IO
//   });

  
// // console.log(server,'the server');


// app.use(express.json())
// app.use(express.urlencoded({extended: true}));
// app.use(cors())

// // console.log(io,'the IO');


// const users = new Map(); 

// io.on('connection', (socket: any) => {
//   console.log(`Socket connected: ${socket.id}`);

//   // Handle authentication
//   socket.on('authenticate', (token: any) => {
//       try {
//           // Assuming jwtDecode correctly decodes the JWT and extracts the payload
//           const decoded = jwtDecode<CustomJwtPayload>(token);
//           if (decoded.userId) {
//               // Convert userId to string for consistency in map keys
//               users.set(decoded.userId.toString(), socket.id);
//               console.log(`User ${decoded.userId} connected with socket ID ${socket.id}`);
//           }
//       } catch (error) {
//           console.error('Token decoding error:', error);
//       }
//   });

//   // Handle disconnection
//   socket.on('disconnect', () => {
//       console.log(`Socket disconnected: ${socket.id}`);
//       // Iterate over the users map to find and remove the disconnected socketId
//       for (let [userId, socketId] of users.entries()) {
//           if (socketId === socket.id) {
//               users.delete(userId);
//               console.log(`Removed user ${userId} from users map.`);
//               break; // Exit the loop once the user is found and removed
//           }
//       }
//   });

//   // Add more event handlers as needed...
// });;

  
// app.use("/users",userRoutes)
// app.use('/clients',clientRoutes)
// app.use('/studies',studyRoutes)
// app.use("/userStudy",userStudiesRoutes)


// app.get("/api/download/:fileId",async (req:any,res:any)=>{
//     const fileId=parseInt(req.params.fileId)
//     try {
//         const file = await prisma.files.findUnique({
//             where :{idFiles:fileId}
//         });
//         if(!file){
//             res.status(404).json({ message: 'File not found' });
//       return;
//         }
//         const fileBuffer = file.FileContent;
//         res.setHeader('Content-Type', 'application/pdf');
//         res.setHeader(
//           'Content-Disposition',
//           `attachment; filename=${file.FileName}`
//         );
    
//         // Send the file content as a response
//         res.send(fileBuffer);
//     }catch (error) {
//         console.error('Error downloading file:', error);
//         res.status(500).json({ message: 'Internal server error' });
//       }
// })

// const PORT = process.env.PORT || 3002;

// server.listen(PORT,()=>{
//     console.log("DB connected on port",PORT);     
// })  


// export {io,users}
import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { setupSocketIO } from './socketManager'; // Adjust the path as necessary
import clientRoutes from './routes/clientRoutes';
import notificationRoutes from './routes/notificationRoutes';
import userRoutes from "./routes/userRoutes"
import studyRoutes from './routes/studyRoutes'
import userStudiesRoutes  from './routes/userStudyRoutes'


const app = express();
const server = createServer(app);
const { io, users } = setupSocketIO(server); // This line integrates Socket.IO with the server

app.use(cors({
  origin: "*", // Adjust this according to your needs
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup your routes
app.use("/clients", clientRoutes);
app.use("/users", userRoutes);
app.use("/studies", studyRoutes);
app.use("/userStudy", userStudiesRoutes);
app.use('/notifications', notificationRoutes);

// Example route for file download
app.get("/api/download/:fileId", async (req, res) => {
  // Implementation remains the same as your provided example
});

const PORT = process.env.PORT || 3003;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { io, users }; // Export these if you need to use them elsewhere in your application
