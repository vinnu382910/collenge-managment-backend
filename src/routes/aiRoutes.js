import { Router } from 'express';
import { chatWithAssistant } from '../controllers/aiController.js';

const router = Router();

router.post('/assistant', chatWithAssistant);

export default router;
