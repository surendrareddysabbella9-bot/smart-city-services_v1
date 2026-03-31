import express from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, getProfile, updateProfile } from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, error: 'Maximum auth attempts exceeded. Blocked.' }
});

const router = express.Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

export default router;
