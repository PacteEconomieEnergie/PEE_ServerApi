"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudyService = void 0;
const prismaClient_1 = require("../utils/prismaClient");
const StudiesStatus_1 = require("../interfaces/StudiesStatus");
const NotificationService_1 = require("./NotificationService");
const typeGuards_1 = require("../utils/typeGuards");
const socketManager_1 = require("../utils/socketManager");
class StudyService {
    constructor() {
        // Initialize NotificationService with the current io instance and the users map
        this.notificationService = new NotificationService_1.NotificationService(socketManager_1.io, socketManager_1.users);
    }
    createStudy(studyData, file, clientId, userId, createdById) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!file) {
                throw new Error('File is missing');
            }
            // Convert strings to numbers where necessary
            const clientIdNum = parseInt(clientId, 10);
            const userIdNum = parseInt(userId, 10);
            const createdByIdNum = parseInt(createdById, 10);
            const facturedInt = studyData.Factured === 'true' || studyData.Factured === true ? 1 : 0;
            // Create the study
            const newStudy = yield prismaClient_1.prisma.studies.create({
                data: Object.assign(Object.assign({}, studyData), { Factured: facturedInt, client: {
                        connect: { IdClient: clientIdNum },
                    }, createdByUser: {
                        connect: { UserID: createdByIdNum },
                    }, users_has_studies: {
                        create: {
                            users: {
                                connect: { UserID: userIdNum },
                            },
                        },
                    }, files: {
                        create: {
                            FileName: file.originalname,
                            FileType: file.mimetype,
                            FileContent: file.buffer,
                            uploadDate: new Date(),
                            FileSize: file.size,
                        },
                    } }),
            });
            // Notify the specified user about the new study
            yield this.notificationService.notifyNewStudy(userId, newStudy);
            return newStudy;
        });
    }
    getAllStudies() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prismaClient_1.prisma.studies.findMany({
                include: {
                    files: { select: {
                            idFiles: true,
                            isSynthese: true
                        } },
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
                            users: { select: {
                                    UserID: true,
                                    FullName: true,
                                    Role: true,
                                    Email: true
                                } }
                        },
                    },
                },
            });
        });
    }
    getStudiesByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const studies = yield prismaClient_1.prisma.users_has_studies.findMany({
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
            }
            catch (error) {
                console.error('Failed to retrieve studies for the user:', error);
                throw error; // Rethrow the error to be handled by the caller
            }
        });
    }
    uploadSyntheseFile(studyId, file) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!file) {
                throw new Error('File is missing');
            }
            // Create a new file record and mark it as a synthèse file
            const syntheseFile = yield prismaClient_1.prisma.files.create({
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
            const updatedStudy = yield prismaClient_1.prisma.studies.update({
                where: { IdStudies: studyId },
                data: { Status: 'Done' },
                include: { createdByUser: true },
            });
            if (updatedStudy.createdByUser) {
                yield this.notificationService.notifyStudyStatusUpdate(updatedStudy.createdByUser.UserID.toString(), updatedStudy);
            }
            return { syntheseFile, updatedStudy };
        });
    }
    getEngineersStudies() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const engineers = yield prismaClient_1.prisma.users.findMany({
                    where: {
                        Role: 'ENGINEER',
                    },
                    include: {
                        users_has_studies: {
                            include: {
                                studies: {
                                    include: {
                                        files: true,
                                        client: true // Include files information if needed
                                    }
                                }
                            }
                        }
                    }
                });
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
                        name: engineer.FullName || 'Unnamed Engineer',
                        photo: engineer.Avatar || "/default/path/to/avatar.svg", // Adjust as necessary
                        tasks: studies.map(study => ({ IdStudy: study.IdStudies, type: study.TypeEtude, Status: study.Status, client: {
                                id: study.client.IdClient,
                                name: study.client.ClientName,
                            }, })),
                        studiesReceived,
                        studiesCompleted,
                        studiesInProgress,
                        studiesToDo,
                    };
                });
                return engineersData;
            }
            catch (error) {
                console.error('Error in getEngineersStudies service:', error);
                throw new Error('Failed to retrieve engineers and their studies');
            }
        });
    }
    updateStudyStatus(studyId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Object.values(StudiesStatus_1.StudiesStatus).includes(status)) {
                throw new Error("Invalid status value.");
            }
            const updatedStudy = yield prismaClient_1.prisma.studies.update({
                where: { IdStudies: studyId },
                data: { Status: status },
                include: { createdByUser: true }
            });
            // If the study's creator is online, send a notification via Socket.IO
            if (updatedStudy.createdByUser) {
                const creatorSocketId = socketManager_1.users.get(updatedStudy.createdByUser.UserID.toString());
                if (creatorSocketId) {
                    this.notificationService.notifyStudyStatusUpdate(updatedStudy.createdByUser.UserID.toString(), updatedStudy);
                }
            }
            return updatedStudy;
        });
    }
    addModification(studyId, file, userId, typeDeRetouche, additionalRetouch) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!file) {
                throw new Error('File is missing');
            }
            if (!(0, typeGuards_1.isTypeDeRetouche)(typeDeRetouche)) {
                throw new Error('Invalid TypeDeRetouche value');
            }
            // Fetch the current study to get the existing nombreDeRetouche
            const study = yield prismaClient_1.prisma.studies.findUnique({
                where: { IdStudies: studyId },
            });
            if (!study) {
                throw new Error('Study not found');
            }
            // Calculate the new nombreDeRetouche
            const newNombreDeRetouche = ((_a = study.NomberDeRetouche) !== null && _a !== void 0 ? _a : 0) + additionalRetouch;
            // Update the study with the new nombreDeRetouche and TypeDeRetouche
            const updatedStudy = yield prismaClient_1.prisma.studies.update({
                where: { IdStudies: studyId },
                data: {
                    NomberDeRetouche: newNombreDeRetouche,
                    TypeDeRetouche: typeDeRetouche,
                },
            });
            // Add the file to the file history with the updated modification number
            const modificationFile = yield prismaClient_1.prisma.filehistory.create({
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
                },
            });
            return { updatedStudy, modificationFile };
        });
    }
}
exports.StudyService = StudyService;
