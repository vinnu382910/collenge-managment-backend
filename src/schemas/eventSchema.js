import { z } from 'zod';

export const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long'),
  description: z.string().min(10, 'Description must be at least 10 characters long'),
  category: z.string().min(2, 'Category is required'),
  event_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Event date must be in YYYY-MM-DD format'),
  start_time: z.string().min(1, 'Start time is required'),
  end_time: z.string().min(1, 'End time is required'),
  venue: z.string().min(2, 'Venue is required'),
  organizer: z.string().min(2, 'Organizer is required'),
  image_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  max_participants: z.coerce.number().int().positive('Max participants must be greater than 0'),
  registration_deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Registration deadline must be in YYYY-MM-DD format')
}).refine(data => {
  return new Date(data.registration_deadline) <= new Date(data.event_date);
}, {
  message: 'Registration deadline cannot be after the event date',
  path: ['registration_deadline']
});
