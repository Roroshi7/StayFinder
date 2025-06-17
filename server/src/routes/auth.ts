import express from 'express';
import {
  register,
  login,
  getMe,
  getProfile,
  updateProfile,
  becomeHost,
} from '../controllers/auth';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/become-host', protect, becomeHost);

export default router; 