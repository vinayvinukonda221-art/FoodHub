import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  getAllUsers
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.get('/', protect, admin, getAllUsers);

export default router;

