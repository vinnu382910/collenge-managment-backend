import { Router } from 'express';
import { registerStudent, registerAdmin } from '../controllers/authController.js';

const router = Router();

router.post('/register', registerStudent);
router.post('/admin-register', registerAdmin);

export default router;
