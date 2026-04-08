// FocusSync Backend Server
// Main entry point - Express + Socket.io + MongoDB (Local)

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');

const app = express();
const server = http.createServer(app);

// ============ Socket.io Setup ============
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// ============ Middleware ============
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(mongoSanitize());
app.use(morgan('dev'));

// ============ MongoDB Connection (Local) ============
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/focussync';

mongoose.connection.on('connected', () => console.log('✅ MongoDB Connected (local)'));
mongoose.connection.on('error', (err) => console.error('❌ MongoDB Error:', err.message));
mongoose.connection.on('disconnected', () => console.log('⚠️  MongoDB Disconnected'));

mongoose.connect(MONGODB_URI)
  .then(() => console.log('🗄️  Connected to local MongoDB (Compass)'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Failed:', err.message);
    console.log('💡 Make sure MongoDB is running locally or set MONGODB_URI env var');
  });

// ============ Models ============
const Session = require('./models/Session');
const User = require('./models/User');
const auth = require('./middleware/auth');

// ============ Health Check ============
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// ============ Auth Routes (with rate limiting) ============
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many attempts. Try again later.' },
});
app.use('/api/auth', authLimiter, require('./routes/auth'));

// ============ Protected API Routes (rate limited + auth) ============
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests.' },
});

// Apply auth middleware only to non-auth routes
app.use('/api', (req, res, next) => {
  // Skip rate limiter and auth for /api/auth/* (already handled above)
  if (req.path.startsWith('/auth')) return next();
  apiLimiter(req, res, () => auth(req, res, next));
});
app.get('/api/analytics/:roomId', require('./routes/analytics'));
app.get('/api/leaderboard', require('./routes/leaderboard'));
app.get('/api/heatmap', require('./routes/heatmap'));
app.get('/api/user/stats/:userId', require('./routes/userStats'));

// ============ Active Sessions (in-memory) ============
const activeSessions = {};

// ============ Socket.io Handlers ============
io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  socket.on('join_room', (data) => {
    try {
      const { roomId, username } = data || {};

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

  socket.on('start_session', async (data) => {
    try {
      const { roomId, duration, userId } = data || {};

      if (!roomId || !duration) {
        return socket.emit('error', { message: 'Missing roomId or duration' });
      }
      if (!activeSessions[roomId]) {
        return socket.emit('error', { message: 'Join a room before starting' });
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
        console.log('💾 Session saved');
      } catch (err) {
        console.error('Error saving session:', err);
      }

      io.to(roomId).emit('session_started', { startTime, endTime });
    } catch (err) {
      console.error('Error in start_session:', err);
      socket.emit('error', { message: 'Failed to start session' });
    }
  });

  socket.on('distraction', async (data) => {
    try {
      const { roomId } = data || {};

      if (!roomId || !activeSessions[roomId]) {
        return socket.emit('error', { message: 'No active session' });
      }

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

  socket.on('disconnect', () => {
    console.log('🔌 User disconnected:', socket.id);
  });
});

// ============ 404 & Error Handlers ============
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
});

app.use((err, req, res, _next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: err.message });
});

// ============ Start Server ============
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 FocusSync Server running on http://localhost:${PORT}`);
});

module.exports = { app, server, io };
