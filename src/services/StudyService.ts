import { prisma } from "../utils/prismaClient";
import { UploadedFile } from "../interfaces/UploadedFile";
import {StudiesStatus} from '../interfaces/StudiesStatus'
 import { NotificationService } from './NotificationService';
import { isTypeDeRetouche } from "../utils/typeGuards";
import { getIo, users } from '../utils/socketManager';
import e from "express";
// import { setupSocketIO } from '../utils/socketManager';
export class StudyService {
  private get io() {
    return getIo(); // This will call getIo() only when io is accessed
    
  }
  private notificationService = new NotificationService();
  constructor() {

  }
 
  public async createStudy(studyData: any, file: UploadedFile, clientId: string, userId: string, createdById: string) {
    if (!file) {
      throw new Error('File is missing');
    }
  
    // Convert strings to numbers where necessary  
    const clientIdNum = parseInt(clientId, 10);
    const userIdNum = parseInt(userId, 10);
    const createdByIdNum = parseInt(createdById, 10);
  
    const facturedInt = studyData.Factured === 'true' ? 1 : 0;
  
    // Create the study
    const newStudy = await prisma.studies.create({
      data: {
        ...studyData,
        Factured: facturedInt,
        client: {
          connect: { IdClient: clientIdNum },
        },
        createdByUser: {
          connect: { UserID: createdByIdNum },
        },
        users_has_studies: {
          create: {
            users: {
              connect: { UserID: userIdNum },
            },
          },
        },
        files: {
          create: {
            FileName: file.originalname,
            FileType: file.mimetype,
            FileContent: file.buffer,
            uploadDate: new Date(),
            FileSize: file.size,
          },
        },
      },
    });
    
  
    // Notify the specified user about the new study
    // const receiverSocketId = users.get(parseInt(userId, 10));
    // if (receiverSocketId) {
    //   console.log('Socket ID:', receiverSocketId);
      
    //   this.io.to(receiverSocketId).emit('newStudyCreated', {
    //     studyId: newStudy.IdStudies,
    //     message: "A new study has been created."
    //   });
    // }
    await this.notificationService.notifyNewStudy(userIdNum, newStudy);
    return newStudy;
  }
  
      public async getAllStudies() {
        return await prisma.studies.findMany({
          include: {
            files:{select:{
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
                users: { select: {
                    UserID: true,
                    FullName: true,
                    Role: true,
                    Email:true
                }}
              },
            },
          },
        });
      }

      public async getStudiesByUserId(userId: number) {
        try {
          const studies = await prisma.users_has_studies.findMany({
            where: { Users_UserID: userId },
            include: {
              studies: {
                include: {
                  files: { select: { idFiles: true, isSynthese: true } },
                  client: true,
                  createdByUser: {
                    select: {
                      UserID: true,
                      Role: true,
                      FullName: true,
                      Email: true
                    }
                  },
                  users_has_studies: {
                    include: {
                      users: {
                        select: {
                          UserID: true,
                          FullName: true,
                          Role: true,
                          Email: true
                        }
                      }
                    }
                  }
                }
              }
            }
          });
          return studies;
        } catch (error) {
          console.error('Failed to retrieve studies for the user:', error);
          throw error; // Rethrow the error to be handled by the caller
        }
      }

      public async uploadSyntheseFile(studyId: number, file: UploadedFile): Promise<any> {
        if (!file) {
            throw new Error('File is missing');
        }
      
        // Create a new file record and mark it as a synthèse file
        const syntheseFile = await prisma.files.create({
            data: {
                FileName: file.originalname,
                FileType: file.mimetype,
                FileContent: file.buffer,
                uploadDate: new Date(),
                FileSize: file.size,
                isSynthese: true,
                Studies_IdStudies: studyId,
            },
        });
      
        // Optionally, update the study status to 'Done' or another appropriate status
        const updatedStudy = await prisma.studies.update({
            where: { IdStudies: studyId },
            data: { Status: 'Done' },
            include: { createdByUser: {
              select: {
                UserID: true,
                Email: true,
              }
            
            }, 
            client:{select:{
              IdClient:true,
              ClientName:true
            
            } },
            users_has_studies: {
              include: {
                users:{
                  select:{
                  UserID:true,
                  FullName:true,
                  Email:true
                
                }}, // Include users details
              }
            }}, 
        });
      console.log(updatedStudy, "the updated study");
      
        if (updatedStudy.createdByUser) {
          const creatorSocketId = users.get(updatedStudy.createdByUser.UserID);
          if (creatorSocketId) {
            this.io.to(creatorSocketId).emit('syntheseFileUploaded', {
              studyId: updatedStudy.IdStudies,
              status: updatedStudy.Status,
            studyNature: updatedStudy.TypeEtude,
            clientName: updatedStudy.client.ClientName,
            uploadedBy: updatedStudy.users_has_studies[0].users.FullName||updatedStudy.users_has_studies[0].users.Email,
            });
          }
        }
      
        return { syntheseFile, updatedStudy };
      }
    public async getEngineersStudies() {
      try {
        const engineers = await prisma.users.findMany({
          where: {
            Role: 'ENGINEER',
          },
          include: {
            
            users_has_studies: {
              include: {
                studies: {
                  include: {
                    files: true,
                    client:true // Include files information if needed
                  }
                }
              }
            }
          }
        });
        console.log(engineers, "the engineers");
        
        // Transform the fetched data to match the required structure
        const engineersData = engineers.map(engineer => {
          // Flatten the studies data structure
          const studies = engineer.users_has_studies.flatMap(uhs => uhs.studies);
  
          // Aggregate study statuses
          const studiesReceived = studies.length;
          const studiesCompleted = studies.filter(study => study.Status === 'Done').length;
          const studiesInProgress = studies.filter(study => study.Status === 'inProgress').length;
          const studiesToDo = studies.filter(study => study.Status === 'toDo').length;
  
          return {
            id: engineer.UserID,
            Email:engineer.Email,
            name: engineer.FullName || 'Unnamed Engineer',
            photo: engineer.Avatar || "/default/path/to/avatar.svg", // Adjust as necessary
            tasks: studies.map(study => ({ IdStudy: study.IdStudies, type: study.TypeEtude, Status: study.Status,client: {
              id: study.client.IdClient,
              name: study.client.ClientName,
            },})),
            studiesReceived,
            studiesCompleted,
            studiesInProgress,
            studiesToDo,
          };
        });
  
        return engineersData;
      } catch (error) {
        console.error('Error in getEngineersStudies service:', error);
        throw new Error('Failed to retrieve engineers and their studies');
      }
    }
      
    public async updateStudyStatus(studyId: number, status: StudiesStatus): Promise<any> {
      if (!Object.values(StudiesStatus).includes(status)) {
        throw new Error("Invalid status value.");
      }
    
      const updatedStudy = await prisma.studies.update({
        where: { IdStudies: studyId },
        data: { Status: status },
        include: { createdByUser: {
          select: {
            UserID: true,
            Email: true,
          }
        
        },
      client:{select:{
        IdClient:true,
        ClientName:true
      
      } },
      users_has_studies: {
        include: {
          users:{
            select:{
            UserID:true,
            FullName:true,
            Email:true
          
          }}, // Include users details
        }
      } }
      });
    
      // If the study's creator is online, send a notification via Socket.IO
      if (updatedStudy.createdByUser) {
        const creatorSocketId = users.get(updatedStudy.createdByUser.UserID);
        if (creatorSocketId) {
          console.log(updatedStudy.users_has_studies[0].users, "the updated study");
          
          this.io.to(creatorSocketId).emit('studyStatusUpdate', {
            studyId: updatedStudy.IdStudies,
            status: updatedStudy.Status,
            studyNature: updatedStudy.TypeEtude,
            clientName: updatedStudy.client.ClientName,
            uploadedBy: updatedStudy.users_has_studies[0].users.FullName||updatedStudy.users_has_studies[0].users.Email,
            
          });
        }
      }
    
      return updatedStudy;
    }

    public async addModification(studyId: number, file: UploadedFile, userId: number, typeDeRetouche: string, additionalRetouch: number, comment: string): Promise<any> {
      if (!file) {
          throw new Error('File is missing');
      }
      if (!isTypeDeRetouche(typeDeRetouche)) {
        throw new Error('Invalid TypeDeRetouche value');  
    }
      // Fetch the current study to get the existing nombreDeRetouche
      const study = await prisma.studies.findUnique({
          where: { IdStudies: studyId },
      });
  
      if (!study) {
          throw new Error('Study not found');
      }
  
      // Calculate the new nombreDeRetouche
      const newNombreDeRetouche = (study.NomberDeRetouche ?? 0) + additionalRetouch;
  
      // Update the study with the new nombreDeRetouche and TypeDeRetouche
      const updatedStudy = await prisma.studies.update({
          where: { IdStudies: studyId },
          data: {
              NomberDeRetouche: newNombreDeRetouche,
              TypeDeRetouche: typeDeRetouche,
          },
      });
  
      // Add the file to the file history with the updated modification number
      const modificationFile = await prisma.filehistory.create({
          data: {
              FileName: file.originalname,
              FileType: file.mimetype,
              FileContent: file.buffer,
              UploadDate: new Date(),
              FileSize: file.size,
              modificationNumber: newNombreDeRetouche,
              modificationDate: new Date(),
              Studies_IdStudies: studyId,
              Users_UserID: userId,
              Comment: comment,
          },  
      });
  
      return { updatedStudy, modificationFile };
  }
}  