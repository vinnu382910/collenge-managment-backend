import { z } from 'zod';

export const studentSignupSchema = z.object({
  full_name: z.string().trim().min(2, 'Full name must be at least 2 characters'),
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  college: z.string().trim().min(2, 'Please select or enter your college'),
  department: z.string().trim().min(2, 'Please select your department'),
  year: z.string().trim().min(1, 'Please select your academic year')
});

export const adminSignupSchema = z.object({
  full_name: z.string().trim().min(2, 'Full name must be at least 2 characters'),
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  college: z.string().trim().min(2, 'Please specify your institution'),
  department: z.string().trim().min(2, 'Please specify your administrative department'),
  year: z.string().trim().default('Faculty / Staff Coordinator'),
  admin_passcode: z.string().trim().min(1, 'Admin authorization passcode is required')
});
