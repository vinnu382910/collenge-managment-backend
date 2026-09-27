# EventHub – College Event Management System (Backend API) 🎓

Express.js REST API with Zod validation, Supabase PostgreSQL, and Google Gemini AI integration.

## 🚀 Features
- **Authentication & Profiles**: Secure student & admin account registration and role verification using Supabase Auth.
- **Event Management**: Full CRUD operations for college events (Workshops, Hackathons, Seminars, Cultural, Sports, etc.).
- **Registration Engine**: Enforces seat quotas, prevents duplicate registrations, and checks registration deadlines.
- **AI Assistant**: Controlled, context-grounded Q&A powered by Google Gemini API using `@google/genai` SDK.
- **Security & Authorization**: CORS configuration, JWT verification, and admin-only role guards.

## 🛠️ Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database & Auth**: Supabase PostgreSQL
- **Validation**: Zod
- **AI**: Google Gemini (`@google/genai`)

## ⚙️ Environment Variables
Create a `.env` file in the root of the backend:

```env
PORT=5000
FRONTEND_URL=https://your-frontend-deployment.vercel.app

# Supabase Credentials (from Supabase Dashboard > Project Settings > API)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Google Gemini API Key (from Google AI Studio)
GEMINI_API_KEY=your_gemini_api_key
```

> ⚠️ **IMPORTANT**: Never commit `.env` or expose the `SUPABASE_SERVICE_ROLE_KEY` to any client-side code!

## 📦 Getting Started Locally

```bash
# 1. Install dependencies
npm install

# 2. Seed database & test connection
npm run test:db
npm run seed

# 3. Start development server
npm run dev
```

## 📡 API Endpoints Summary

### Health
- `GET /api/health` — Service health check

### Auth
- `POST /api/auth/register` — Student account registration
- `POST /api/auth/admin-register` — Administrator registration (Passcode required)

### Events
- `GET /api/events` — List all events (supports `?search=`, `?category=`, `?sort=`)
- `GET /api/events/:id` — Single event details with capacity and registration status
- `POST /api/events` — Create new event (Admin only)
- `PUT /api/events/:id` — Update event (Admin only)
- `DELETE /api/events/:id` — Delete event (Admin only)

### Registrations
- `POST /api/events/:id/register` — Student event registration
- `DELETE /api/events/:id/register` — Cancel registration
- `GET /api/my-events` — View registered events for logged-in student

### Admin
- `GET /api/admin/dashboard` — Event, student, and registration analytics
- `GET /api/admin/events/:id/registrations` — View attendees roster for an event

### AI Assistant
- `POST /api/ai/assistant` — Query EventHub AI assistant
