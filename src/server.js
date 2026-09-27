import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// ==============================================================================
// 1. GLOBAL MIDDLEWARES
// ==============================================================================

// CORS configuration (Allows React Vite development server)
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman) or matching FRONTEND_URL
    if (!origin || origin === FRONTEND_URL || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parser Middleware
app.use(express.json());

// ==============================================================================
// 2. HEALTH CHECK ROUTE
// ==============================================================================
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'EventHub backend is running',
    timestamp: new Date().toISOString()
  });
});

// ==============================================================================
// 3. API ROUTE MOUNTING
// ==============================================================================
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api', registrationRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);

// ==============================================================================
// 4. 404 CATCH-ALL HANDLER
// ==============================================================================
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found on EventHub backend.`
  });
});

// ==============================================================================
// 5. CENTRAL ERROR HANDLER
// ==============================================================================
app.use(errorHandler);

// ==============================================================================
// 6. SERVER INITIALIZATION
// ==============================================================================
app.listen(PORT, () => {
  console.log(`🚀 EventHub Backend Server listening on http://localhost:${PORT}`);
  console.log(`🌐 Allowed Frontend Origin: ${FRONTEND_URL}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
});
