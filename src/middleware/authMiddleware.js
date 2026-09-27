import { supabase } from '../config/supabase.js';

/**
 * Authentication Middleware
 * Validates the Supabase JWT token passed in the Authorization header.
 * Attaches the authenticated user object with profile details and role to req.user.
 */
export async function authenticateUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Missing or invalid Bearer token.'
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token is required.'
      });
    }

    // Verify token with Supabase Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session. Please log in again.'
      });
    }

    // Fetch the user's profile to obtain their role (student or admin)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, full_name, email, role, college, department, year')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return res.status(403).json({
        success: false,
        message: 'User profile not found. Please contact an administrator.'
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      ...profile
    };

    next();
  } catch (error) {
    console.error('Auth Middleware Exception:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication verification.'
    });
  }
}
