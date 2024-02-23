// statsRoutes.ts
import express from 'express';
import {prisma} from '../utils/prismaClient';

const router = express.Router();

router.get('/dashboard', async (req, res) => {
    try {
        const engineersCount = await prisma.users.count({
            where: { Role: 'ENGINEER' },
        });
        const assistantsCount = await prisma.users.count({
            where: { Role: 'ASSISTANT' },
        });
        const clientsCount = await prisma.client.count();
        const studiesCount = await prisma.studies.count();

        res.json({
            engineersCount,
            assistantsCount,
            clientsCount,
            studiesCount,
        });
    } catch (error) {
        console.error('Error fetching dashboard statistics:', error);
        res.status(500).json({ message: 'Failed to fetch dashboard statistics' });
    }
});

export default router;
