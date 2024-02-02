import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getUserStudies = async (req: Request, res: Response) => {
    const { userId } = req.params; // Assuming the user ID is provided as a route parameter
  
    try {
      const userStudies = await prisma.users.findUnique({
        where: {
          UserID: Number(userId), // Convert the parameter to a number if needed
        },
        select: {
          users_has_studies: {
            include: {
              studies: true,
            },
          },
        },
      });
  console.log(userStudies);
  
      // Access the related studies for the user
      const studies = userStudies?.users_has_studies.map((entry) => entry.studies) || [];
  
      res.json({ studies });
    } catch (error) {
      res.status(500).json(error);
    }
  };
  const getStudyUsers = async (req: Request, res: Response) => {
    const { studyId } = req.params; // Assuming the study ID is provided as a route parameter
  console.log(req.params);
  
    try {
      const studyUsers = await prisma.studies.findUnique({
        where: {
          IdStudies: Number(studyId), // Convert the parameter to a number if needed
        },
        select: {
          users_has_studies: {
            include: {
              users: true,
            },
          },
        },
      });
  console.log(studyUsers,"the st");
  
      // Access the related users for the study
      const users = studyUsers?.users_has_studies.map((entry) => entry.users) || [];
  
      res.json({ users });
    } catch (error) {
      res.status(500).json({ error: 'Could not fetch study users' });
    }
  };

export{getUserStudies,getStudyUsers}