"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const clientController_1 = require("../controller/clientController");
const router = (0, express_1.Router)();
const clientController = new clientController_1.ClientController();
router.get('/studies', clientController.getClientsStudies); // Route to fetch clients' studies with statistics
router.post('/add', clientController.createClient); // Route to create a new client
router.get('/', clientController.getAllClients); // Route to fetch all clients
router.get('/:id', clientController.getClientById); // Route to fetch a client by ID
router.put('/:id', clientController.updateClient); // Route to update a client by ID
router.delete('/:id', clientController.deleteClient); // Route to delete a client by ID
// Add other routes for updating, deleting clients, etc.
exports.default = router;
