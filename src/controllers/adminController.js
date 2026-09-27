import { supabase } from '../config/supabase.js';

/**
 * GET /api/admin/dashboard
 * Aggregates statistics for the Admin dashboard:
 * Total Events, Upcoming Events, Total Registrations, Total Students, Recent Activity.
 */
export async function getAdminDashboard(req, res, next) {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Total Events
    const { count: totalEvents } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true });

    // Upcoming Events
    const { count: upcomingEvents } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true })
      .gte('event_date', today);

    // Total Registrations
    const { count: totalRegistrations } = await supabase
      .from('event_registrations')
      .select('*', { count: 'exact', head: true });

    // Total Students
    const { count: totalStudents } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'student');

    // Recent 5 events
    const { data: recentEvents } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    // Recent 5 registrations
    const { data: recentRegistrations } = await supabase
      .from('event_registrations')
      .select(`
        id,
        registered_at,
        profiles (full_name, email, department, year),
        events (title, event_date)
      `)
      .order('registered_at', { ascending: false })
      .limit(5);

    return res.status(200).json({
      success: true,
      data: {
        stats: {
          total_events: totalEvents || 0,
          upcoming_events: upcomingEvents || 0,
          total_registrations: totalRegistrations || 0,
          total_students: totalStudents || 0
        },
        recent_events: recentEvents || [],
        recent_registrations: recentRegistrations || []
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/admin/events/:id/registrations
 * Returns the list of registered students for a specific event.
 */
export async function getEventRegistrations(req, res, next) {
  try {
    const { id: eventId } = req.params;

    const { data: registrations, error } = await supabase
      .from('event_registrations')
      .select(`
        id,
        registered_at,
        profiles (
          id,
          full_name,
          email,
          college,
          department,
          year
        )
      `)
      .eq('event_id', eventId)
      .order('registered_at', { ascending: false });

    if (error) {
      throw error;
    }

    const students = registrations.map(r => ({
      registration_id: r.id,
      registered_at: r.registered_at,
      ...r.profiles
    }));

    return res.status(200).json({
      success: true,
      data: students
    });
  } catch (error) {
    next(error);
  }
}
