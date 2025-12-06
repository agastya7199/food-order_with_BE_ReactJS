import express from 'express';
import { register, login } from '../controllers/authController.js';
import { getProfile, updateProfile, changePassword } from '../controllers/profileController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

export default router;
