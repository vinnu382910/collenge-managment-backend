import { Router } from 'express';
import { getAdminDashboard, getEventRegistrations } from '../controllers/adminController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticateUser, requireAdmin);

router.get('/dashboard', getAdminDashboard);
router.get('/events/:id/registrations', getEventRegistrations);

export default router;
