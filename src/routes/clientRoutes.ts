
import { Router } from 'express';
import { ClientController } from '../controller/clientController';

const router = Router();
const clientController = new ClientController();
router.get('/studies', clientController.getClientsStudies); // Route to fetch clients' studies with statistics
router.post('/add', clientController.createClient); // Route to create a new client
router.get('/',clientController.getAllClients); // Route to fetch all clients
router.get('/:id',clientController.getClientById); // Route to fetch a client by ID
router.put('/:id',clientController.updateClient); // Route to update a client by ID
router.delete('/:id',clientController.deleteClient); // Route to delete a client by ID
// Add other routes for updating, deleting clients, etc.

export default router;