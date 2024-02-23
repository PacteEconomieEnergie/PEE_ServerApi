// fileRoutes.ts
import express from 'express';
import {prisma} from '../utils/prismaClient'; // Update the import path according to your project structure

const router = express.Router();

router.get("/download/:fileId", async (req, res) => {
    const fileId = parseInt(req.params.fileId);
    try {
        const file = await prisma.files.findUnique({
            where: {idFiles: fileId}
        });
        if (!file) {
            res.status(404).json({ message: 'File not found' });
            return;
        }
        const fileBuffer = file.FileContent;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${file.FileName}`);
        res.send(fileBuffer);
    } catch (error) {
        console.error('Error downloading file:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
