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
exports.ClientController = void 0;
const ClientService_1 = require("../services/ClientService");
class ClientController {
    constructor() {
        this.createClient = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { ClientName } = req.body;
                const newClient = yield this.clientService.createClient({ ClientName });
                res.json(newClient);
            }
            catch (error) {
                res.status(500).send({ error: 'Failed to create a new client' });
            }
        });
        this.getAllClients = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const allClients = yield this.clientService.getAllClients();
                res.json(allClients);
            }
            catch (error) {
                res.status(500).send({ error: 'Failed to fetch clients' });
            }
        });
        this.getClientById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const client = yield this.clientService.getClientById(id);
                if (client) {
                    res.json(client);
                }
                else {
                    res.status(404).send({ error: 'Client not found' });
                }
            }
            catch (error) {
                res.status(500).send({ error: 'Failed to fetch client' });
            }
        });
        this.updateClient = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const clientData = req.body;
                const updatedClient = yield this.clientService.updateClient(id, clientData);
                res.json(updatedClient);
            }
            catch (error) {
                res.status(500).send({ error: 'Failed to update client' });
            }
        });
        this.deleteClient = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield this.clientService.deleteClient(id);
                res.status(204).send();
            }
            catch (error) {
                res.status(500).send({ error: 'Failed to delete client' });
            }
        });
        // Method to get clients' studies with their statistics
        this.getClientsStudies = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const clientsStudies = yield this.clientService.getClientsStudies();
                res.json(clientsStudies);
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Failed to retrieve clients and their studies statistics', error });
            }
        });
        this.clientService = new ClientService_1.ClientService();
    }
}
exports.ClientController = ClientController;
