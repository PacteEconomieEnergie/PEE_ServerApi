import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

 const createClient = async (req: Request, res: Response) => {
  try {
    const { ClientName } = req.body;

    const newClient = await prisma.client.create({
      data: {
        ClientName,
      },
    });

    res.json(newClient);
  } catch (error) {
    res.status(500).send({ error: 'Failed to create a new client' });
  }
};

 const getAllClients = async (req: Request, res: Response) => {
  try {
    const allClients = await prisma.client.findMany();

    res.json(allClients);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch clients' });
  }
};

export {createClient,getAllClients}