import express from 'express';
import { registerAdmin, assignAdminRole } from '../controllers/adminController.js';
import { isAuthenticated, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to register a new admin (protected by secret key)
// router.post('/register-admin', registerAdmin);

// Route to assign admin role to an existing user (requires admin privileges)
router.put('/assign-admin-role/:userId', isAuthenticated, isAdmin, assignAdminRole);

export default router;
