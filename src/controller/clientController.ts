import { Request, Response } from 'express';
import { ClientService } from '../services/ClientService';

export class ClientController {
  private clientService: ClientService;

  constructor() {
    this.clientService = new ClientService();
  }

  public createClient = async (req: Request, res: Response): Promise<void> => {
    try {
      const { ClientName } = req.body;

      const newClient = await this.clientService.createClient({ ClientName });

      res.json(newClient);
    } catch (error) {
      res.status(500).send({ error: 'Failed to create a new client' });
    }
  };

  public getAllClients = async (req: Request, res: Response): Promise<void> => {
    try {
      const allClients = await this.clientService.getAllClients();

      res.json(allClients);
    } catch (error) {
      res.status(500).send({ error: 'Failed to fetch clients' });
    }
  };
  public getClientById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const client = await this.clientService.getClientById(id);
      if (client) {
        res.json(client);
      } else {
        res.status(404).send({ error: 'Client not found' });
      }
    } catch (error) {
      res.status(500).send({ error: 'Failed to fetch client' });
    }
  };
  public updateClient = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const clientData = req.body;
      const updatedClient = await this.clientService.updateClient(id, clientData);
      res.json(updatedClient);
    } catch (error) {
      res.status(500).send({ error: 'Failed to update client' });
    }
  };

  public deleteClient = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.clientService.deleteClient(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).send({ error: 'Failed to delete client' });
    }
  };
  // Method to get clients' studies with their statistics
  public getClientsStudies = async (req: Request, res: Response): Promise<void> => {
    try {
      const clientsStudies = await this.clientService.getClientsStudies();

      res.json(clientsStudies);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Failed to retrieve clients and their studies statistics', error });
    }
  };
}
