import { supabase } from '../config/supabase.js';
import { eventSchema } from '../schemas/eventSchema.js';

/**
 * GET /api/events
 * Retrieves events with search, category filtering, and sorting.
 * Computes registration count and remaining seats for each event.
 */
export async function getEvents(req, res, next) {
  try {
    const { search, category, sort } = req.query;

    let query = supabase.from('events').select('*');

    // Filter by Category
    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    // Search by title or description or venue
    if (search && search.trim() !== '') {
      query = query.or(`title.ilike.%${search.trim()}%,description.ilike.%${search.trim()}%,venue.ilike.%${search.trim()}%`);
    }

    // Sorting options
    if (sort === 'date_asc' || !sort) {
      query = query.order('event_date', { ascending: true });
    } else if (sort === 'date_desc') {
      query = query.order('event_date', { ascending: false });
    } else if (sort === 'title_asc') {
      query = query.order('title', { ascending: true });
    } else if (sort === 'title_desc') {
      query = query.order('title', { ascending: false });
    }

    const { data: events, error } = await query;

    if (error) {
      throw error;
    }

    // Get registration counts for all returned events
    const eventIds = events.map(e => e.id);
    let countsMap = {};

    if (eventIds.length > 0) {
      const { data: regData, error: regError } = await supabase
        .from('event_registrations')
        .select('event_id');

      if (!regError && regData) {
        regData.forEach(reg => {
          countsMap[reg.event_id] = (countsMap[reg.event_id] || 0) + 1;
        });
      }
    }

    const today = new Date().toISOString().split('T')[0];

    const enhancedEvents = events.map(evt => {
      const registeredCount = countsMap[evt.id] || 0;
      const remainingSeats = Math.max(0, evt.max_participants - registeredCount);
      const isFull = registeredCount >= evt.max_participants;
      const isClosed = evt.registration_deadline < today;

      return {
        ...evt,
        current_registrations: registeredCount,
        remaining_seats: remainingSeats,
        is_full: isFull,
        is_closed: isClosed
      };
    });

    return res.status(200).json({
      success: true,
      data: enhancedEvents
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/events/:id
 * Retrieves single event details with capacity and user registration status if authenticated.
 */
export async function getEventById(req, res, next) {
  try {
    const { id } = req.params;

    const { data: event, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.'
      });
    }

    // Count registrations
    const { count: regCount, error: countError } = await supabase
      .from('event_registrations')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', id);

    const today = new Date().toISOString().split('T')[0];
    const registeredCount = regCount || 0;
    const remainingSeats = Math.max(0, event.max_participants - registeredCount);
    const isFull = registeredCount >= event.max_participants;
    const isClosed = event.registration_deadline < today;

    // Check if the current user is registered (if auth token was provided)
    let isUserRegistered = false;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) {
        const { data: userReg } = await supabase
          .from('event_registrations')
          .select('id')
          .eq('event_id', id)
          .eq('user_id', user.id)
          .maybeSingle();

        if (userReg) {
          isUserRegistered = true;
        }
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        ...event,
        current_registrations: registeredCount,
        remaining_seats: remainingSeats,
        is_full: isFull,
        is_closed: isClosed,
        is_user_registered: isUserRegistered
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/events (Admin Only)
 * Creates a new college event.
 */
export async function createEvent(req, res, next) {
  try {
    const validatedData = eventSchema.parse(req.body);

    const { data: newEvent, error } = await supabase
      .from('events')
      .insert([validatedData])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return res.status(201).json({
      success: true,
      message: 'Event created successfully!',
      data: newEvent
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
      });
    }
    next(error);
  }
}

/**
 * PUT /api/events/:id (Admin Only)
 * Updates an existing college event.
 */
export async function updateEvent(req, res, next) {
  try {
    const { id } = req.params;
    const validatedData = eventSchema.parse(req.body);

    const { data: updatedEvent, error } = await supabase
      .from('events')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return res.status(200).json({
      success: true,
      message: 'Event updated successfully!',
      data: updatedEvent
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
      });
    }
    next(error);
  }
}

/**
 * DELETE /api/events/:id (Admin Only)
 * Deletes an event and cascades registrations.
 */
export async function deleteEvent(req, res, next) {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return res.status(200).json({
      success: true,
      message: 'Event and associated registrations deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
}
