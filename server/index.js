// FocusSync Backend Server
// Main entry point - Express + Socket.io + MongoDB

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Initialize Socket.io with CORS enabled
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection - Local MongoDB
const MONGODB_URI = 'mongodb://localhost:27017/focussync';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected to local database'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// ============ Models ============
const Session = require('./models/Session');
const User = require('./models/User');

// Remove inline Session schema definition (now in separate file)

// ============ Routes ============
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// In-memory storage for active sessions
const activeSessions = {};

// ============ Socket.io Handlers ============
io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  // User joins a room
  socket.on('join_room', (data) => {
    const { roomId, username } = data;
    
    socket.join(roomId);
    console.log(`User ${username} (${socket.id}) joined room ${roomId}`);

    if (!activeSessions[roomId]) {
      activeSessions[roomId] = {
        userCount: 0,
        distractionCount: 0,
        endTime: null,
        startTime: null,
        users: []
      };
    }

    if (username && !activeSessions[roomId].users.includes(username)) {
      activeSessions[roomId].users.push(username);
    }

    activeSessions[roomId].userCount = activeSessions[roomId].users.length;

    socket.emit('room_state', {
      userCount: activeSessions[roomId].userCount,
      distractionCount: activeSessions[roomId].distractionCount,
      endTime: activeSessions[roomId].endTime,
      startTime: activeSessions[roomId].startTime,
      users: activeSessions[roomId].users
    });

    io.to(roomId).emit('users_list', activeSessions[roomId].users);

    if (activeSessions[roomId].endTime) {
      socket.emit('session_sync', {
        endTime: activeSessions[roomId].endTime,
        startTime: activeSessions[roomId].startTime
      });
    }

    socket.to(roomId).emit('user_count', activeSessions[roomId].userCount);
  });

  // Start a new session
  socket.on('start_session', async (data) => {
    const { roomId, duration, userId } = data;

    console.log(`Starting session in room ${roomId} for ${duration} minutes`);

    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + duration * 60 * 1000);

    activeSessions[roomId] = {
      ...activeSessions[roomId],
      startTime,
      endTime,
      distractionCount: 0
    };

    const session = new Session({
      roomId,
      userId,
      startTime,
      endTime,
      distractions: 0,
      focusScore: 100,
      events: [{ type: 'start', time: startTime }]
    });

    try {
      await session.save();
      console.log('💾 Session saved to MongoDB');
    } catch (err) {
      console.error('Error saving session:', err);
    }

    io.to(roomId).emit('session_started', {
      startTime,
      endTime
    });
  });

  // Handle distraction events
  socket.on('distraction', async (data) => {
    const { roomId } = data;

    console.log(`Distraction detected in room ${roomId}`);

    if (activeSessions[roomId]) {
      activeSessions[roomId].distractionCount++;

      try {
        const session = await Session.findOne({
          roomId,
          startTime: activeSessions[roomId].startTime
        }).sort({ startTime: -1 });

        if (session) {
          session.distractions = activeSessions[roomId].distractionCount;
          session.events.push({ type: 'distraction', time: new Date() });
          await session.save();
        }
      } catch (err) {
        console.error('Error updating distraction:', err);
      }
    }

    io.to(roomId).emit('distraction_count', {
      count: activeSessions[roomId]?.distractionCount || 0
    });
  });

  // End session
  socket.on('end_session', async (data) => {
    const { roomId } = data;

    console.log(`Ending session in room ${roomId}`);

    if (activeSessions[roomId]) {
      const endTime = new Date();

      try {
        const session = await Session.findOne({
          roomId,
          startTime: activeSessions[roomId].startTime
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
    }
  });

  // User disconnects
  socket.on('disconnect', () => {
    console.log('🔌 User disconnected:', socket.id);
  });
});

// ============ REST API Routes ============

// GET /api/analytics/:roomId - Get all sessions for a room
app.get('/api/analytics/:roomId', async (req, res) => {
  try {
    const sessions = await Session.find({ roomId: req.params.roomId })
      .sort({ startTime: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/leaderboard - Get top rooms by total focus time
app.get('/api/leaderboard', async (req, res) => {
  try {
    const leaderboard = await Session.aggregate([
      {
        $group: {
          _id: '$roomId',
          totalFocusTime: {
            $sum: { $subtract: ['$endTime', '$startTime'] }
          },
          totalSessions: { $sum: 1 },
          avgFocusScore: { $avg: '$focusScore' }
        }
      },
      { $sort: { totalFocusTime: -1 } },
      { $limit: 10 }
    ]);
    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/heatmap - Get sessions grouped by date
app.get('/api/heatmap', async (req, res) => {
  try {
    const heatmap = await Session.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$startTime' }
          },
          sessionCount: { $sum: 1 },
          totalFocusTime: {
            $sum: { $subtract: ['$endTime', '$startTime'] }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    res.json(heatmap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/user/stats/:userId - Get user-specific statistics
app.get('/api/user/stats/:userId', async (req, res) => {
  try {
    const stats = await Session.aggregate([
      { $match: { userId: req.params.userId } },
      {
        $group: {
          _id: null,
          totalSessions: { $sum: 1 },
          totalFocusTime: {
            $sum: { $subtract: ['$endTime', '$startTime'] }
          },
          avgFocusScore: { $avg: '$focusScore' },
          totalDistractions: { $sum: '$distractions' }
        }
      }
    ]);
    res.json(stats[0] || { totalSessions: 0, totalFocusTime: 0, avgFocusScore: 0, totalDistractions: 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 FocusSync Server running on port ${PORT}`);
});
