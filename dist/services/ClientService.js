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
exports.ClientService = void 0;
const prismaClient_1 = require("../utils/prismaClient");
class ClientService {
    createClient(clientData) {
        return __awaiter(this, void 0, void 0, function* () {
            const newClient = yield prismaClient_1.prisma.client.create({
                data: clientData,
            });
            return newClient;
        });
    }
    getAllClients() {
        return __awaiter(this, void 0, void 0, function* () {
            const clients = yield prismaClient_1.prisma.client.findMany();
            return clients;
        });
    }
    getClientById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield prismaClient_1.prisma.client.findUnique({
                where: { IdClient: parseInt(id) },
            });
            return client;
        });
    }
    updateClient(id, clientData) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedClient = yield prismaClient_1.prisma.client.update({
                where: { IdClient: parseInt(id) },
                data: clientData,
            });
            return updatedClient;
        });
    }
    deleteClient(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prismaClient_1.prisma.client.delete({
                where: { IdClient: parseInt(id) },
            });
        });
    }
    getClientsStudies() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const clients = yield prismaClient_1.prisma.client.findMany({
                    include: {
                        studies: {
                            include: {
                                files: true, // Include files if needed
                            }
                        }
                    }
                });
                // Transform the fetched data for clients
                const clientsData = clients.map(client => {
                    const studiesReceived = client.studies.length;
                    const studiesCompleted = client.studies.filter(study => study.Status === 'Done').length;
                    const studiesInProgress = client.studies.filter(study => study.Status === 'inProgress').length;
                    const studiesToDo = client.studies.filter(study => study.Status === 'toDo').length;
                    // New calculations for retouche type studies based on their status
                    const retoucheStudies = client.studies.filter(study => study.TypeEtude === 'Retouche').length;
                    const retoucheStudiesCompleted = client.studies.filter(study => study.TypeEtude === 'Retouche' && study.Status === 'Done').length;
                    const retoucheStudiesInProgress = client.studies.filter(study => study.TypeEtude === 'Retouche' && study.Status === 'inProgress').length;
                    const retoucheStudiesToDo = client.studies.filter(study => study.TypeEtude === 'Retouche' && study.Status === 'toDo').length;
                    return {
                        clientId: client.IdClient,
                        clientName: client.ClientName,
                        studiesReceived,
                        studiesCompleted,
                        studiesInProgress,
                        studiesToDo,
                        // Include detailed retouche studies statistics
                        retoucheStudies: {
                            total: retoucheStudies,
                            completed: retoucheStudiesCompleted,
                            inProgress: retoucheStudiesInProgress,
                            toDo: retoucheStudiesToDo,
                        },
                        studies: client.studies.map(study => ({
                            IdStudy: study.IdStudies,
                            type: study.TypeEtude,
                            Status: study.Status,
                            // Additional study fields as needed
                        }))
                    };
                });
                return clientsData;
            }
            catch (error) {
                console.log(error);
                console.error('Error in getClientsStudies service:', error);
                throw new Error('Failed to retrieve clients and their studies statistics');
            }
        });
    }
}
exports.ClientService = ClientService;
