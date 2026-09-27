import { supabase } from '../config/supabase.js';

/**
 * GET /api/profile
 * Returns the current authenticated user's profile.
 */
export async function getProfile(req, res, next) {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error || !profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found.'
      });
    }

    return res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/profile
 * Updates the user's profile (name, college, department, year).
 * Prevents non-admins from modifying their own role!
 */
export async function updateProfile(req, res, next) {
  try {
    const { full_name, college, department, year } = req.body;

    const updates = {
      updated_at: new Date().toISOString()
    };

    if (full_name !== undefined) updates.full_name = full_name.trim();
    if (college !== undefined) updates.college = college.trim();
    if (department !== undefined) updates.department = department.trim();
    if (year !== undefined) updates.year = year.trim();

    // Critical security check: Never allow role modification through this endpoint
    delete updates.role;

    const { data: updatedProfile, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      data: updatedProfile
    });
  } catch (error) {
    next(error);
  }
}
