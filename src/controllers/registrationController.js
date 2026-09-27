import { supabase } from '../config/supabase.js';

/**
 * POST /api/events/:id/register
 * Registers the authenticated student for an event with capacity & deadline validation.
 */
export async function registerForEvent(req, res, next) {
  try {
    const { id: eventId } = req.params;
    const userId = req.user.id;

    // 1. Fetch Event
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (eventError || !event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.'
      });
    }

    // 2. Check Registration Deadline
    const today = new Date().toISOString().split('T')[0];
    if (event.registration_deadline < today) {
      return res.status(400).json({
        success: false,
        message: 'Registration deadline has passed. Registration is closed.'
      });
    }

    // 3. Check Current Capacity
    const { count: registeredCount } = await supabase
      .from('event_registrations')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId);

    if ((registeredCount || 0) >= event.max_participants) {
      return res.status(400).json({
        success: false,
        message: 'This event is full. No remaining seats.'
      });
    }

    // 4. Check If Already Registered
    const { data: existingReg } = await supabase
      .from('event_registrations')
      .select('id')
      .eq('event_id', eventId)
      .eq('user_id', userId)
      .maybeSingle();

    if (existingReg) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event.'
      });
    }

    // 5. Insert Registration Record
    const { data: newRegistration, error: insertError } = await supabase
      .from('event_registrations')
      .insert([
        {
          event_id: eventId,
          user_id: userId
        }
      ])
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    return res.status(201).json({
      success: true,
      message: 'Successfully registered for the event!',
      data: newRegistration
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/events/:id/register
 * Cancels a student's event registration.
 */
export async function cancelRegistration(req, res, next) {
  try {
    const { id: eventId } = req.params;
    const userId = req.user.id;

    const { error } = await supabase
      .from('event_registrations')
      .delete()
      .eq('event_id', eventId)
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    return res.status(200).json({
      success: true,
      message: 'Registration canceled successfully.'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/my-events
 * Retrieves all events registered by the authenticated student.
 */
export async function getMyEvents(req, res, next) {
  try {
    const userId = req.user.id;

    const { data: registrations, error } = await supabase
      .from('event_registrations')
      .select(`
        id,
        registered_at,
        events (
          id,
          title,
          description,
          category,
          event_date,
          start_time,
          end_time,
          venue,
          organizer,
          image_url,
          max_participants,
          registration_deadline
        )
      `)
      .eq('user_id', userId)
      .order('registered_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Format clean structure
    const formatted = registrations.map(r => ({
      registration_id: r.id,
      registered_at: r.registered_at,
      ...r.events
    }));

    return res.status(200).json({
      success: true,
      data: formatted
    });
  } catch (error) {
    next(error);
  }
}
