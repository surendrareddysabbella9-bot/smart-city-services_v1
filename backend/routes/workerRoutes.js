import express from 'express';
import { getWorkers, getWorkerById, getWorkerHistory, getWorkerCertifications, addCertification } from '../controllers/workerController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticate, getWorkers);
router.get('/:id', getWorkerById);
router.get('/:id/history', getWorkerHistory);
router.get('/:id/certifications', getWorkerCertifications);
router.post('/add-certification', addCertification);

export default router;
