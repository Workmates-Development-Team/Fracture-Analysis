import express from 'express';
import { registerAdmin, loginAdmin, updateAdmin, deleteAdmin, getProfile } from './controller.js';
import { validateAdmin, validateLogin } from '../src/Middlewares/adminValidator.js';
import { authenticateToken } from '../src/Middlewares/authMiddleware.js';

const router = express.Router();

// Public Routes
router.post('/register', validateAdmin, registerAdmin);
router.post('/login', validateLogin, loginAdmin);
router.get('/profile', authenticateToken, getProfile);

// Protected Routes
router.put('/:id', authenticateToken, validateAdmin, updateAdmin);
router.delete('/:id', authenticateToken, deleteAdmin);

export default router;
