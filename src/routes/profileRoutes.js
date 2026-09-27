import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authenticateUser, getProfile);
router.put('/', authenticateUser, updateProfile);

export default router;
