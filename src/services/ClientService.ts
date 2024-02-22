import { prisma } from "../utils/prismaClient";

export class ClientService {
    public async createClient(clientData: any) {
        const newClient = await prisma.client.create({
            data: clientData,
        });
        return newClient;
    }

    public async getAllClients() {
        const clients = await prisma.client.findMany();
        return clients;
    }

    public async getClientById(id: string) {
        const client = await prisma.client.findUnique({
            where: { IdClient: parseInt(id) },
        });
        return client;
    }

    public async updateClient(id: string, clientData: any) {
        const updatedClient = await prisma.client.update({
            where: { IdClient: parseInt(id) },
            data: clientData,
        });
        return updatedClient;
    }

    public async deleteClient(id: string) {
        await prisma.client.delete({
            where: { IdClient: parseInt(id) },
        });
    }


    public async getClientsStudies() {
        try {
            const clients = await prisma.client.findMany({
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
        } catch (error) {
            console.log(error);
            
            console.error('Error in getClientsStudies service:', error);
            throw new Error('Failed to retrieve clients and their studies statistics');
        }
    }
}