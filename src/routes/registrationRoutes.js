import { Router } from 'express';
import {
  registerForEvent,
  cancelRegistration,
  getMyEvents
} from '../controllers/registrationController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = Router();

// Student registration routes (Protected)
router.post('/events/:id/register', authenticateUser, registerForEvent);
router.delete('/events/:id/register', authenticateUser, cancelRegistration);
router.get('/my-events', authenticateUser, getMyEvents);

export default router;
