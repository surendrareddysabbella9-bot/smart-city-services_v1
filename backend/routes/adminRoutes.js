import express from 'express';
import { getUsers, verifyWorker, getPendingWorkers } from '../controllers/adminController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate, authorize(['Admin']));

router.get('/users', getUsers);
router.get('/workers/pending', getPendingWorkers);
router.put('/verify-worker', verifyWorker);

export default router;
