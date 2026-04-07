// FocusSync Backend Server
// Main entry point - Express + Socket.io + MongoDB

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');

// ============ Environment Configuration ============
const isProd = process.env.NODE_ENV === 'production';

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/focussync';
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('❌ JWT_SECRET environment variable is required. Set it before starting the server.');
  console.error('   Generate one with: openssl rand -base64 64');
  process.exit(1);
}

// Parse client URLs from env (comma-separated)
const clientUrls = (process.env.CLIENT_URL || 'http://localhost:3000')
  .split(',')
  .map(u => u.trim())
  .filter(Boolean);

const app = express();
const server = http.createServer(app);

// ============ Security Middleware ============

// Security headers
app.use(helmet());

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// Prevent NoSQL injection via query/body sanitization
app.use(mongoSanitize());

// HTTP request logging
app.use(morgan(isProd ? 'combined' : 'dev'));

// ============ CORS Configuration ============
app.use(cors({
  origin: isProd ? clientUrls : true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ============ Rate Limiting ============
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts. Please try again later.' },
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
});

// ============ Socket.io Setup ============
const io = socketIo(server, {
  cors: {
    origin: isProd ? clientUrls : true,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

// ============ MongoDB Connection ============
let dbConnected = false;

mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB Connected');
  dbConnected = true;
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB Error:', err.message);
  dbConnected = false;
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB Disconnected');
  dbConnected = false;
});

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: isProd ? 10000 : 5000,
  socketTimeoutMS: 45000,
})
  .then(() => console.log(`🗄️  MongoDB connection established (${isProd ? 'production' : 'development'})`))
  .catch((err) => {
    console.error('❌ MongoDB Connection Failed:', err.message);
    if (isProd) {
      console.error('Server cannot start without MongoDB in production mode.');
      process.exit(1);
    }
  });

// ============ Models ============
const Session = require('./models/Session');
const User = require('./models/User');
const auth = require('./middleware/auth');

// ============ Health Check ============
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: dbConnected ? 'connected' : 'disconnected',
    environment: isProd ? 'production' : 'development',
  });
});

// ============ Routes ============
app.use('/api/auth', authLimiter, require('./routes/auth'));

// Protected API routes
app.use('/api', apiLimiter, auth); // auth middleware applies to all below
app.get('/api/analytics/:roomId', require('./routes/analytics'));
app.get('/api/leaderboard', require('./routes/leaderboard'));
app.get('/api/heatmap', require('./routes/heatmap'));
app.get('/api/user/stats/:userId', require('./routes/userStats'));

// In-memory storage for active sessions (single instance)
const activeSessions = {};

// ============ Socket.io Handlers ============
io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  // User joins a room
  socket.on('join_room', (data) => {
    try {
      const { roomId, username } = data || {};

      // Validate input
      if (!roomId || typeof roomId !== 'string') {
        return socket.emit('error', { message: 'Invalid room ID' });
      }
      if (!username || typeof username !== 'string' || username.length > 50) {
        return socket.emit('error', { message: 'Invalid username' });
      }

      socket.join(roomId);
      console.log(`User ${username} (${socket.id}) joined room ${roomId}`);

      if (!activeSessions[roomId]) {
        activeSessions[roomId] = {
          userCount: 0,
          distractionCount: 0,
          endTime: null,
          startTime: null,
          users: [],
        };
      }

      if (!activeSessions[roomId].users.includes(username)) {
        activeSessions[roomId].users.push(username);
      }

      activeSessions[roomId].userCount = activeSessions[roomId].users.length;

      socket.emit('room_state', {
        userCount: activeSessions[roomId].userCount,
        distractionCount: activeSessions[roomId].distractionCount,
        endTime: activeSessions[roomId].endTime,
        startTime: activeSessions[roomId].startTime,
        users: activeSessions[roomId].users,
      });

      io.to(roomId).emit('users_list', activeSessions[roomId].users);

      if (activeSessions[roomId].endTime) {
        socket.emit('session_sync', {
          endTime: activeSessions[roomId].endTime,
          startTime: activeSessions[roomId].startTime,
        });
      }

      socket.to(roomId).emit('user_count', activeSessions[roomId].userCount);
    } catch (err) {
      console.error('Error in join_room:', err);
      socket.emit('error', { message: 'Failed to join room' });
    }
  });

  // Start a new session
  socket.on('start_session', async (data) => {
    try {
      const { roomId, duration, userId } = data || {};

      if (!roomId || !duration) {
        return socket.emit('error', { message: 'Missing roomId or duration' });
      }

      if (!activeSessions[roomId]) {
        return socket.emit('error', { message: 'Join a room before starting a session' });
      }

      console.log(`Starting session in room ${roomId} for ${duration} minutes`);

      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + duration * 60 * 1000);

      activeSessions[roomId] = {
        ...activeSessions[roomId],
        startTime,
        endTime,
        distractionCount: 0,
      };

      const session = new Session({
        roomId,
        userId,
        startTime,
        endTime,
        distractions: 0,
        focusScore: 100,
        events: [{ type: 'start', time: startTime }],
      });

      try {
        await session.save();
        console.log('💾 Session saved to MongoDB');
      } catch (err) {
        console.error('Error saving session:', err);
      }

      io.to(roomId).emit('session_started', { startTime, endTime });
    } catch (err) {
      console.error('Error in start_session:', err);
      socket.emit('error', { message: 'Failed to start session' });
    }
  });

  // Handle distraction events
  socket.on('distraction', async (data) => {
    try {
      const { roomId } = data || {};

      if (!roomId || !activeSessions[roomId]) {
        return socket.emit('error', { message: 'No active session to record distraction' });
      }

      console.log(`Distraction detected in room ${roomId}`);

      activeSessions[roomId].distractionCount++;

      try {
        const session = await Session.findOne({
          roomId,
          startTime: activeSessions[roomId].startTime,
        }).sort({ startTime: -1 });

        if (session) {
          session.distractions = activeSessions[roomId].distractionCount;
          session.events.push({ type: 'distraction', time: new Date() });
          await session.save();
        }
      } catch (err) {
        console.error('Error updating distraction:', err);
      }

      io.to(roomId).emit('distraction_count', {
        count: activeSessions[roomId].distractionCount,
      });
    } catch (err) {
      console.error('Error in distraction:', err);
      socket.emit('error', { message: 'Failed to record distraction' });
    }
  });

  // End session
  socket.on('end_session', async (data) => {
    try {
      const { roomId } = data || {};

      if (!roomId || !activeSessions[roomId]) {
        return socket.emit('error', { message: 'No active session to end' });
      }

      console.log(`Ending session in room ${roomId}`);

      const endTime = new Date();

      try {
        const session = await Session.findOne({
          roomId,
          startTime: activeSessions[roomId].startTime,
        }).sort({ startTime: -1 });

        if (session) {
          session.endTime = endTime;
          session.events.push({ type: 'end', time: endTime });
          session.focusScore = Math.max(0, 100 - (session.distractions * 10));
          await session.save();
          console.log('💾 Session ended and saved');
        }
      } catch (err) {
        console.error('Error ending session:', err);
      }

      activeSessions[roomId].endTime = null;
      activeSessions[roomId].startTime = null;
      activeSessions[roomId].distractionCount = 0;

      io.to(roomId).emit('session_ended');
    } catch (err) {
      console.error('Error in end_session:', err);
      socket.emit('error', { message: 'Failed to end session' });
    }
  });

  // User disconnects
  socket.on('disconnect', () => {
    console.log('🔌 User disconnected:', socket.id);
  });
});

// ============ 404 Handler ============
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
});

// ============ Error Handler ============
app.use((err, req, res, _next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    error: isProd ? 'Internal server error' : err.message,
  });
});

// ============ Graceful Shutdown ============
const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log('HTTP server closed');
    mongoose.connection.close().then(() => {
      console.log('MongoDB connection closed');
      process.exit(0);
    }).catch(() => process.exit(1));
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.log('Forcing shutdown...');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// ============ Start Server ============
server.listen(PORT, () => {
  console.log(`🚀 FocusSync Server running on port ${PORT}`);
  console.log(`📡 Environment: ${isProd ? 'production' : 'development'}`);
  console.log(`🔗 API: http://localhost:${PORT}`);
});

module.exports = { app, server, io };
