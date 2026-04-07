# FocusSync

A real-time collaborative study platform built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.io.

## 🌟 New Enhanced Features

### Recently Added (To Impress Your Professor!)

1. **🔐 User Authentication** - Login/Signup with JWT tokens, persistent sessions
2. **📊 Better Charts** - Beautiful charts using Recharts library
3. **📈 Focus Score Trend** - Line chart showing focus score improvement over time
4. **🏆 Achievement Badges** - Earn badges for milestones (First Session, Focus Master, Zen Master, etc.)
5. **👤 User Names** - Join rooms with a username, see active users list
6. **⌨️ Keyboard Shortcuts** - Space to start, E to end, D to test distraction
7. **🔔 Desktop Notifications** - Browser notifications for session events
8. **🔊 Sound Effects** - Audio feedback using Web Audio API (no external files)
9. **📦 Demo Data Button** - Load sample data instantly for presentations
10. **📥 Export Report** - Download session report as text file
11. **🧑‍💻 Tech Stack Page** - Architecture diagram and viva questions at `/techstack`

---

## Features

- 🎯 **Real-time Timer Sync** - All users in a room see the same countdown timer
- 👥 **Multi-user Rooms** - Study together with friends in real-time
- ⚠️ **Distraction Detection** - Uses Page Visibility API to detect when you switch tabs
- 📊 **Analytics Dashboard** - Track sessions, focus scores, and productivity
- 🏆 **Leaderboard** - Compete with other rooms for most focus time
- 🔥 **Activity Heatmap** - Visualize your study patterns
- 🎖️ **Achievements** - Unlock badges for your accomplishments
- 📈 **Weekly Trends** - See your progress over time (Recharts)
- 📉 **Focus Score Trend** - Track improvement with line charts
- 🔔 **Notifications** - Desktop alerts for session events
- 🎵 **Sound Effects** - Audio feedback for actions
- 🔐 **User Accounts** - JWT authentication with persistent login

---

## Project Structure

```
FocusSync/
├── client/          # React frontend (create-react-app)
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── Navbar.js
│       │   ├── Timer.js
│       │   ├── Achievements.js      ← NEW
│       │   └── WeeklyTrend.js       ← NEW
│       └── pages/
│           ├── Home.js
│           ├── Room.js              ← ENHANCED
│           ├── Dashboard.js         ← ENHANCED
│           └── TechStack.js         ← NEW
├── server/          # Node.js + Express backend
│   └── index.js
└── package.json
```

---

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally on port 27017)

---

## Installation

1. **Install dependencies:**
   ```bash
   npm run install:all
   ```

2. **Start MongoDB** (if not already running):
   ```bash
   mongod
   ```

---

## Running the Application

### Option 1: Run both together
```bash
npm run dev
```

### Option 2: Run separately (in different terminals)

**Terminal 1 - Backend:**
```bash
npm run start:backend
```

**Terminal 2 - Frontend:**
```bash
npm run start:frontend
```

---

## Usage

1. Open `http://localhost:3000` in your browser
2. Create a new room or join an existing one
3. Enter your username and join
4. Start a focus session (15, 25, 45, or 60 minutes)
5. Stay focused! Switching tabs counts as a distraction
6. View your analytics on the Dashboard
7. **For Presentation:** Click "Load Demo Data" to show all features

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Start session |
| `E` | End session |
| `D` | Test distraction (debug) |

---

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/analytics/:roomId` | Get all sessions for a room |
| `GET /api/leaderboard` | Get top rooms by focus time |
| `GET /api/heatmap` | Get sessions grouped by date |

---

## Socket.io Events

### Client → Server
- `join_room` - Join a study room (with username)
- `start_session` - Start a new focus session
- `end_session` - End current session
- `distraction` - Report a distraction

### Server → Client
- `room_state` - Current room state
- `session_started` - Session has started
- `session_sync` - Sync timer for late joiners
- `session_ended` - Session has ended
- `user_count` - Number of users online
- `distraction_count` - Total distractions
- `users_list` - List of usernames in room

---

## Tech Stack

**Frontend:**
- React 18
- React Router DOM
- Socket.io Client
- Axios

**Backend:**
- Node.js
- Express
- Socket.io
- MongoDB with Mongoose

**Browser APIs:**
- Page Visibility API (distraction detection)
- Notification API (desktop alerts)
- Web Audio API (sound effects)

---

## Viva Preparation

### Architecture
```
┌─────────────┐      WebSocket      ┌─────────────┐      Mongoose      ┌─────────────┐
│   React     │ ←──────────────────→ │  Node.js    │ ←───────────────→  │   MongoDB   │
│  (Port 3000)│      HTTP REST      │ (Port 5000) │                     │ (Port 27017)│
└─────────────┘                     └─────────────┘                     └─────────────┘
```

### Common Viva Questions

1. **How does real-time sync work?**
   - Using Socket.io WebSockets for bidirectional communication between client and server

2. **How are distractions detected?**
   - Page Visibility API (`document.hidden`) detects when user switches tabs or minimizes window

3. **Why MongoDB?**
   - Flexible schema for session events, good for time-series data, easy aggregation for analytics

4. **How is timer kept in sync across users?**
   - Server stores `endTime`, clients calculate remaining time based on server time

5. **What happens when a user joins late?**
   - New users receive `session_sync` event with current timer state (endTime)

6. **How do keyboard shortcuts work?**
   - `window.addEventListener('keydown')` captures key presses, prevents default for Space/E

7. **How do desktop notifications work?**
   - Browser Notification API with permission request, triggered on session events

---

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Join or create rooms |
| Room | `/room/:roomId` | Study room with timer |
| Dashboard | `/dashboard/:roomId` | Analytics and insights |
| Tech Stack | `/techstack` | Architecture & viva prep |

---

## Screenshots

### Features Demonstrated
- ✅ WebSockets (real-time sync)
- ✅ Browser APIs (Visibility, Notifications, Audio)
- ✅ REST APIs (analytics endpoints)
- ✅ MongoDB Aggregation (leaderboard, heatmap)
- ✅ React Hooks (useState, useEffect)
- ✅ Dynamic Routing (React Router)
- ✅ Event-driven Architecture (Socket.io)

---

## Troubleshooting

**MongoDB Connection Error:**
```bash
# Check if MongoDB is running
net start MongoDB

# Or start manually
mongod
```

**Port Already in Use:**
```bash
# Kill process on port 5000 or 3000
# Windows: Use Resource Monitor or restart
```

---

## License

MIT

---

## Credits

Built for Web Technologies Subject Project 🎓
