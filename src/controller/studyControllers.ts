import { PrismaClient, Prisma, studies } from '@prisma/client';
import { Request, Response } from 'express';
import { uploadFile } from "../middelware/multerSetup"
import multer, { MulterError } from 'multer';
import { io,users} from '../../index';
import { Socket } from 'socket.io';
const prisma = new PrismaClient();

interface Studies {
    DateDeReception: Date;
    DateDeSoumission: Date;
    FullName: string;
    Factured: number;
    TypeEtude: "NouvelleEtude" | "Retouche";
    NomberDeRetouche: number | null;
    TypeDeRetouche: "Exterieur" | "Interieur";
    Category: "Classique" | "Precaire" | "GrandPrecaire";
    Nature: "Normale" | "Prioritere";
}
interface UploadedFile {
    originalname: string;
    mimetype: string;
    buffer: Buffer; // File content buffer
    size: number;
    modificationNumber: number
}

const addStudy = async (req: Request, res: Response) => {
    uploadFile(req, res, async (err: any | null) => {

        if (err instanceof multer.MulterError) {
            return res.status(400).send({ error: err })
        } else if (err) {
            res.status(500).send({ error: err })
        }
        else {
            const uploadedFile = req.file as UploadedFile | undefined;

            if (!uploadedFile) {
                return res.status(400).json({ message: 'File is missing' });
            }

            const { factured, ...otherData } = req.body;

            const { clientId, userId } = req.params
            
            // io.emit('connected', userId);

            try {
                const client = await prisma.client.findUnique({
                    where: { IdClient: parseInt(clientId) }
                })
                if (!client) {
                    return res.status(404).send({ message: "Client not found" })
                }

                const facturedInt = factured === 'true' || factured === true ? 1 : 0;
                const newStudy = await prisma.studies.create({
                    data: {...otherData,
                        Factured: facturedInt,
                        client: { connect: { IdClient: client.IdClient } },
                        users_has_studies: {
                            create: {
                                users: {
                                    connect: { UserID: parseInt(userId) }
                                }
                            }     
                        },
                        files: {
                            create: {
                                FileName: uploadedFile.originalname,
                                FileType: uploadedFile.mimetype,
                                FileContent: uploadedFile.buffer, // Assign Buffer directly
                                uploadDate: new Date(),
                                FileSize: uploadedFile.size,
                            },
                        }

                    },
                });  
              
                
                //  const userSocketId = users.get(userId);
                const notification = await prisma.notification.create({
                    data: {
                        userId: parseInt(userId), // Ensure this is the ID of the user assigned to the study
                        studyId: newStudy.IdStudies,
                        seen: false,
                    },
                });

                 
                console.log(`Looking up socket ID for user: ${userId} (Type: ${typeof userId})`);
                const userSocketId = users.get(userId.toString());
                console.log(`Retrieved userSocketId for user ${userId}: ${userSocketId}`);
                
if (userSocketId) {
    io.to(userSocketId).emit('newStudyNotification', { notificationId: notification.id, study: newStudy });
    console.log(newStudy);
    
    console.log(`Notification sent to user ${userId} via socket ${userSocketId}`);
} else {
    console.log(`User ${userId} is not connected via WebSocket. Notification stored ${notification.id}.`);
}
                
                res.json(newStudy);
            } catch (error) {
                if (error instanceof Prisma.PrismaClientValidationError) {
                    // Log the validation error for more details
                    console.error('Validation Error Details:', error);
                    // Handle the error gracefully or return a relevant response
                    return res.status(400).json({ error: error });
                }
                // Handle other types of errors
                console.error(error)
                return res.status(500).json({ error: "an error has occured" });
            }
        }
    })
};
const getAllStudies = async (req: Request, res: Response) => {
    try {
        const allStudies = await prisma.studies.findMany({
            include: {


                files: true,
                client: true,
                users_has_studies: {
                    include: {
                        users: true,
                    },
                },
                // Add more fields to include here if needed
            },
        })


        const studiesWithoutBigInt = allStudies.map((study) => ({
            ...study,
            // Convert the BigInt field `FileSize` to a number
            files: study.files.map((file) => ({
                ...file,
                FileSize: Number(file.FileSize),
                downloadLink: `/api/download/${file.idFiles}`
            })),
        }));
  
        res.json(studiesWithoutBigInt);
    } catch (error) {
        console.error('Error retrieving studies:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const addModification = async (req: Request, res: Response) => {
    uploadFile(req, res, async (err: any | null) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).send({ "errorss": err })
        }
        else if (err) {
            res.status(500).send({ "the error": err })
        }
        else {
            const uploadedFile = req.file as UploadedFile | undefined
            if (!uploadedFile) {
                return res.status(400).send('File is missing');
            }
            const {
                TypeDeRetouche
            }: studies = req.body
            const { IdStudies, UserID } = req.params
            try {
                const study = await prisma.studies.findUnique({
                    where: {
                        IdStudies: parseInt(IdStudies)
                    }
                })
                if (!study) {
                    return res.status(404).send({ message: "Study not found" })
                }
                const nombreDeRetouche = study.NomberDeRetouche || 0
                const updatedStudy = await prisma.studies.update({
                    where: {
                        IdStudies: parseInt(IdStudies),
                    },
                    data: {
                        NomberDeRetouche: nombreDeRetouche + 1,
                        TypeDeRetouche: TypeDeRetouche,

                    },


                })
                const currentDate = new Date()
                const createdFileHistory = await prisma.filehistory.create({
                    data: {
                        FileName: uploadedFile.originalname,
                        FileType: uploadedFile.mimetype,
                        FileContent: uploadedFile.buffer,
                        UploadDate: currentDate,
                        FileSize: uploadedFile.size,
                        modificationNumber: nombreDeRetouche + 1,
                        modificationDate: currentDate,
                        Studies_IdStudies: parseInt(IdStudies),
                        Users_UserID: parseInt(UserID)// Assuming userId is present in the request body
                    }
                })

                res.json({
                    updatedStudy,
                    createdFileHistory: {
                        ...createdFileHistory,
                        FileSize: Number(createdFileHistory.FileSize)
                    }
                })
            } catch (error) {
                if (error instanceof Prisma.PrismaClientValidationError) {
                    // Log the validation error for more details
                    console.error('Validation Error Details:', error);
                    // Handle the error gracefully or return a relevant response
                    return res.status(400).json({ error: 'Validation failed. Please check your data.' });
                }
                console.log(error);

                // Handle other types of errors
                return res.status(500).json({ error: 'An unexpected error occurred.' });
            }
        }
    })


}


// const getOneStudy=async(req:Request,res:Response)=>{
//     try {
//         const oneStudy=await prisma.studies.findUnique()
//     }
// }


export { addStudy, getAllStudies, addModification }