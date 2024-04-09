import  { Request, Response } from 'express';
import { prisma } from '../utils/prismaClient';
export const uploadAvatar = async (req: Request, res: Response) => {
    const { id } = req.params;
    const file = req.file;
    if (!file) {
        return res.status(400).json({ message: 'File is missing.' });
    }
    try {
        const user = await prisma.users.findUnique({
            where: { UserID: parseInt(id) }
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const fileBuffer: Buffer = file.buffer;
        const base64Image = `data:${file.mimetype};base64,${fileBuffer.toString('base64')}`;
        const updatedUser = await prisma.users.update({
            where: { UserID: parseInt(id) },
            data: {
                Avatar: base64Image
            }
        });
        res.status(200).json({ message: 'Avatar updated successfully', updatedUser });
    } catch (error) {
        console.log(error);
        
        res.status(500).json({ message: 'Failed to update avatar', error: error });
    }
}