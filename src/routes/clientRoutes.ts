
import { Router } from 'express';
import { createClient, getAllClients } from '../controller/clientController';

const router = Router();

router.post('/add', createClient); // Route to create a new client
router.get('/', getAllClients); // Route to fetch all clients

// Add other routes for updating, deleting clients, etc.

export default router;