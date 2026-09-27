import { GoogleGenAI } from '@google/genai';
import { supabase } from '../config/supabase.js';

const SYSTEM_INSTRUCTION = `
You are EventHub AI Assistant.
You help college students discover and understand college events.
Only use the event information provided below in the context.
Do not invent event names, dates, venues, registration deadlines, organizers, capacity or availability.
If the requested information is not available in the provided events, clearly state that the information is not currently available on EventHub.
Be concise, friendly, enthusiastic, and useful.

You can help users:
- find events
- explain event details
- recommend events based on interests (e.g. coding, culture, sports, business)
- compare available events
- highlight deadlines and seat constraints

Never claim that a student is registered unless the application explicitly provides that information.
`;

/**
 * Ask Gemini AI Assistant about college events.
 * The backend queries active events and injects them as grounded context.
 */
export async function askEventHubAssistant(userMessage) {
  // Fetch active college events to ground Gemini in reality
  const { data: events, error } = await supabase
    .from('events')
    .select('title, description, category, event_date, start_time, end_time, venue, organizer, max_participants, registration_deadline')
    .order('event_date', { ascending: true });

  const eventsContext = events && events.length > 0 
    ? JSON.stringify(events, null, 2)
    : 'No events currently listed in the database.';

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key' || apiKey.trim() === '') {
    // Graceful fallback when GEMINI_API_KEY is not yet populated
    return {
      reply: `Hello! I am your EventHub AI Assistant. I can see ${events?.length || 0} events currently listed in the college database (including ${events?.map(e => e.title).slice(0, 3).join(', ')}). To enable live intelligent AI conversation, please add your GEMINI_API_KEY in backend/.env!`
    };
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
College Events Database Context:
${eventsContext}

Student's Question:
"${userMessage}"
`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.3
    }
  });

  return {
    reply: response.text
  };
}
