import { Router } from 'express';
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} from '../controllers/eventController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = Router();

// Public routes
router.get('/', getEvents);
router.get('/:id', getEventById);

// Protected Admin-only routes
router.post('/', authenticateUser, requireAdmin, createEvent);
router.put('/:id', authenticateUser, requireAdmin, updateEvent);
router.delete('/:id', authenticateUser, requireAdmin, deleteEvent);

export default router;
