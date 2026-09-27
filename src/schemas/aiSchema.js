import { z } from 'zod';

export const aiChatSchema = z.object({
  message: z.string().trim().min(1, 'Message cannot be empty').max(1000, 'Message cannot exceed 1000 characters')
});
