import { PrismaClient, Prisma, studies, studies_Status } from '@prisma/client';
import { Request, Response } from 'express';
import { uploadFile } from "../middelware/multerSetup"
import multer, { MulterError } from 'multer';
import { io,users} from '../index';
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

            const { clientId, userId,createdById } = req.params
            
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
                        
                        createdByUser: {
                            connect: { UserID: parseInt(createdById) }
                        },
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
    console.log("logs",newStudy);
    
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


                files: {select:{
                    idFiles:true,
                    isSynthese:true
                }},
                client: true,
                createdByUser: {
                    select: {
                        UserID:true,
                        Role: true,
                        FullName: true,
                        Email:true
                    }
                },
                users_has_studies: {
                    include: {
                        users: {
                            select: {
                                UserID: true,
                                FullName: true,
                                Role: true,
                                Email:true
                            }
                        },
                        
                    },
                },
                // Add more fields to include here if needed
            },
        })


        // const studiesWithoutBigInt = allStudies.map((study) => ({
        //     ...study,
        //     // Convert the BigInt field `FileSize` to a number
        //     files: study.files.map((file) => ({
        //         ...file,
        //         FileSize: Number(file.FileSize),
        //         downloadLink: `/api/download/${file.idFiles}`
        //     })),
        // }));
  
        res.json(allStudies);
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

const getStudyById=async (req: Request, res: Response)=>{
    const { userId } = req.params;
  
  try {
    const studies = await prisma.users_has_studies.findMany({
      where: {
        Users_UserID: parseInt(userId),
      },
      include: { 
        studies: {
          include: {
            files: {select:{
                idFiles:true,
                isSynthese:true
            }},
            client: true,
            createdByUser: {
                select: {
                    UserID:true,
                    Role: true,
                    FullName: true,
                    Email:true
                }
            },
            users_has_studies: {
                include: {
                    users: {
                        select: {
                            UserID: true,
                            FullName: true,
                            Role: true,
                            Email:true
                        }
                    },
                    
                },
            }, // Include the files related to the study
          },
          
        },
        
      },
    });
    // const studiesWithFiles = studies.map(entry => ({
    //     ...entry.studies,
    //     files: entry.studies.files.map((file)=>({
    //         ...file,
    //         FileSize:Number(file.FileSize)
    //     })), // Ensure files are included in the response
    //   }));

    res.json(studies);
  } catch (error) {
    console.error('Failed to retrieve studies for the user:', error);
    res.status(500).send(error);
  }
}

const updatedStudyStatus=async (req: Request, res: Response)=>{
    const {studyId}=req.params
    const  { Status } = req.body;
        try{
            
            
            
            if(!Object.values(studies_Status).includes(Status)){
                return res.status(400).json({error:"status non valide ."})
            }
            const updatedStudy  = await prisma.studies.update({
                where:{
                    IdStudies:parseInt(studyId)
                },
                data:{
                    Status:Status
                },
                include: { createdByUser: {select: {
                    UserID: true,
                    FullName: true,
                    Role: true,
                    Email:true
                }}
             }  
            })
            if (updatedStudy.createdByUser) {
                const creatorSocketId = users.get(updatedStudy.createdByUser.UserID.toString());
                if (creatorSocketId) {
                    // Emit a notification to the creator
                    io.to(creatorSocketId).emit('studyStatusUpdated', {
                        message: `Status of study ${updatedStudy.FullName} updated to ${Status}.`,
                        studyId: updatedStudy.IdStudies,
                        newStatus: Status
                    });
                }
            } else {
                console.error('No createdByUser found for this study.');
            }
            res.json(updatedStudy)
        }catch(error){ 
            console.log(error);
            
            res.status(500).json(error)
        }


}

const uploadSyntheseFile = async (req: Request, res: Response) => {
    const studyId = parseInt(req.params.studyId);
    
    // Using the same multer setup as addStudy
    uploadFile(req, res, async (err: any) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).send({ error: err.message });
      } else if (err) {
        return res.status(500).send({ error: err.message });
      }
  
      const uploadedFile = req.file as UploadedFile | undefined;
      if (!uploadedFile) {
        return res.status(400).send({ message: 'File is missing' });
      }
  
      try {
        // Create a new file record and mark it as a synthèse file
        const syntheseFile = await prisma.files.create({
          data: {
            FileName: uploadedFile.originalname,
            FileType: uploadedFile.mimetype,
            FileContent: uploadedFile.buffer,
            uploadDate: new Date(),
            FileSize: uploadedFile.size,
            isSynthese: true,
            Studies_IdStudies: studyId,
          },
        });
  
        // Optionally, update the study status to 'Done' or another status
        await prisma.studies.update({
          where: { IdStudies: studyId },
          data: { Status: 'Done' }, // Update as per your logic
        });
  
        res.json({ message: 'Synthèse file uploaded successfully' });
      } catch (error) {
        console.error('Failed to upload synthèse file:', error);
        res.status(500).send({ error: 'Internal server error' });
      }
    });
  };

export { addStudy, getAllStudies, addModification,getStudyById,updatedStudyStatus,uploadSyntheseFile }