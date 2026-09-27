import { aiChatSchema } from '../schemas/aiSchema.js';
import { askEventHubAssistant } from '../services/geminiService.js';

/**
 * POST /api/ai/assistant
 * Handles student/user inquiries using Google Gemini AI.
 */
export async function chatWithAssistant(req, res, next) {
  try {
    const validated = aiChatSchema.parse(req.body);
    const result = await askEventHubAssistant(validated.message);

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid message',
        errors: error.errors
      });
    }
    next(error);
  }
}
