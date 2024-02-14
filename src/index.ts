import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { PrismaClient, Prisma } from '@prisma/client';
import { setupSocketIO } from './socketManager'; // Adjust the path as necessary
import clientRoutes from './routes/clientRoutes';
import notificationRoutes from './routes/notificationRoutes';
// const userRoutes=require('./src/routes/userRoutes.ts')
import userRoutes from './routes/userRoutes'
// const studyRoutes =require('./src/routes/studyRoutes.ts')
import studyRoutes from "./routes/studyRoutes"
// const  userStudiesRoutes =require( "./src/routes/userStudyRoutes.ts")
import userStudiesRoutes from './routes/userStudyRoutes'
const prisma= new PrismaClient()
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
app.get("/api/download/:fileId",async (req:any,res:any)=>{
    const fileId=parseInt(req.params.fileId)
    try {
        const file = await prisma.files.findUnique({
            where :{idFiles:fileId}
        });
        if(!file){
            res.status(404).json({ message: 'File not found' });
      return;
        }
        const fileBuffer = file.FileContent;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
          'Content-Disposition',
          `attachment; filename=${file.FileName}`
        );
    
        // Send the file content as a response
        res.send(fileBuffer);
    }catch (error) {
        console.error('Error downloading file:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
})

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { io, users }; // Export these if you need to use them elsewhere in your application
