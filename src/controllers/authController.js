import { supabase } from '../config/supabase.js';
import { studentSignupSchema, adminSignupSchema } from '../schemas/authSchema.js';

// Predefined valid admin authorization passcodes for collegiate event directors
const VALID_ADMIN_PASSCODES = ['ADMIN2026', 'EVENTHUB_ADMIN_2026', 'admin123', 'COLLEGE_ADMIN'];

/**
 * POST /api/auth/register
 * Student Account Registration.
 * Uses the Supabase Admin API on the backend with email_confirm: true.
 * This completely avoids the client-side 429 "Email rate limit exceeded" error!
 */
export async function registerStudent(req, res, next) {
  try {
    const validatedData = studentSignupSchema.parse(req.body);

    // 1. Check if user already exists
    const { data: userList, error: listError } = await supabase.auth.admin.listUsers();
    if (!listError && userList?.users) {
      const existing = userList.users.find(u => u.email?.toLowerCase() === validatedData.email.toLowerCase());
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address already exists. Please log in.'
        });
      }
    }

    // 2. Create user with pre-confirmed email (bypasses Supabase free tier email limit)
    const { data: newUserData, error: createError } = await supabase.auth.admin.createUser({
      email: validatedData.email,
      password: validatedData.password,
      email_confirm: true,
      user_metadata: {
        full_name: validatedData.full_name,
        role: 'student',
        college: validatedData.college,
        department: validatedData.department,
        year: validatedData.year
      }
    });

    if (createError) {
      return res.status(400).json({
        success: false,
        message: createError.message
      });
    }

    const userId = newUserData.user.id;

    // 3. Ensure profile is upserted with student role
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        full_name: validatedData.full_name,
        email: validatedData.email,
        role: 'student',
        college: validatedData.college,
        department: validatedData.department,
        year: validatedData.year,
        updated_at: new Date().toISOString()
      });

    if (profileError) {
      console.error('Error syncing student profile:', profileError);
    }

    return res.status(201).json({
      success: true,
      message: 'Student account registered successfully! You can now log in.',
      data: {
        id: userId,
        email: validatedData.email,
        role: 'student'
      }
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: error.errors[0]?.message || 'Validation error',
        errors: error.errors
      });
    }
    next(error);
  }
}

/**
 * POST /api/auth/admin-register
 * Administrator Account Registration.
 * Requires a valid collegiate admin authorization passcode to prevent unauthorized privilege escalation.
 */
export async function registerAdmin(req, res, next) {
  try {
    const validatedData = adminSignupSchema.parse(req.body);

    // 1. Verify Admin Passcode
    if (!VALID_ADMIN_PASSCODES.includes(validatedData.admin_passcode.trim())) {
      return res.status(403).json({
        success: false,
        message: 'Invalid Admin Authorization Passcode. Contact your Campus IT department (or use demo code: ADMIN2026).'
      });
    }

    // 2. Check if user already exists
    const { data: userList, error: listError } = await supabase.auth.admin.listUsers();
    if (!listError && userList?.users) {
      const existing = userList.users.find(u => u.email?.toLowerCase() === validatedData.email.toLowerCase());
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address already exists. Please log in.'
        });
      }
    }

    // 3. Create Admin user in Supabase Auth
    const { data: newUserData, error: createError } = await supabase.auth.admin.createUser({
      email: validatedData.email,
      password: validatedData.password,
      email_confirm: true,
      user_metadata: {
        full_name: validatedData.full_name,
        role: 'admin',
        college: validatedData.college,
        department: validatedData.department,
        year: validatedData.year || 'Faculty / Staff Coordinator'
      }
    });

    if (createError) {
      return res.status(400).json({
        success: false,
        message: createError.message
      });
    }

    const userId = newUserData.user.id;

    // 4. Upsert profile with 'admin' role
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        full_name: validatedData.full_name,
        email: validatedData.email,
        role: 'admin',
        college: validatedData.college,
        department: validatedData.department,
        year: validatedData.year || 'Faculty / Staff Coordinator',
        updated_at: new Date().toISOString()
      });

    if (profileError) {
      console.error('Error syncing admin profile:', profileError);
    }

    return res.status(201).json({
      success: true,
      message: 'Admin account registered successfully! You can now log in to the Admin Command Center.',
      data: {
        id: userId,
        email: validatedData.email,
        role: 'admin'
      }
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: error.errors[0]?.message || 'Validation error',
        errors: error.errors
      });
    }
    next(error);
  }
}
