# 🚀 FocusSync

### A Real-Time Behavioral Monitoring and Distributed Synchronization System

---

## 🧠 Overview

FocusSync is a real-time, event-driven web application that synchronizes study sessions across multiple users while analyzing behavioral patterns such as distraction frequency, focus efficiency, and productivity trends.

Unlike traditional timer applications, FocusSync uses a **server-authoritative architecture** to ensure consistency across distributed clients and prevent client-side manipulation.

> 💡 FocusSync transforms human behavior into measurable system events and actionable insights.

---

## 🎯 Core Innovation

FocusSync goes beyond a typical productivity tool by integrating:

* ⏱️ **Server-controlled synchronization** (prevents cheating and ensures consistency)
* 🔁 **Event-driven architecture** using WebSockets
* 👁️ **Behavioral monitoring** using browser APIs (Page Visibility API)
* 📊 **Analytics-driven feedback** (focus score, trends, insights)

The system converts user actions into structured events and derives meaningful insights from them.

---

## 🏗️ System Architecture

```
┌─────────────┐      WebSocket      ┌─────────────┐      Mongoose      ┌─────────────┐
│   React     │ ←──────────────────→ │  Node.js    │ ←───────────────→  │   MongoDB   │
│  (Client)   │      HTTP REST      │  (Server)   │                     │ (Database)  │
└─────────────┘                     └─────────────┘                     └─────────────┘
```

### Key Principle:

👉 The **server is the single source of truth** for time and session state.

---

## ⚙️ Engineering Concepts Demonstrated

* Real-time synchronization using **Socket.io (WebSockets)**
* **Server-authoritative state management**
* Handling **late joiners** with consistent timer state
* Event-driven communication model
* Behavioral tracking using **Page Visibility API**
* Time-series analytics using MongoDB
* Distributed system consistency across multiple clients

---

## 🔁 System Workflow

1. User joins a room
2. Server maintains session state (start time, end time)
3. Timer is synchronized across all clients
4. Distractions are detected via browser visibility changes
5. Events are logged and stored in MongoDB
6. Analytics engine processes data and generates insights

---

## 🧩 System Capabilities

### 🔹 Real-Time System

* Synchronized timer across users
* Multi-user room support
* Late join synchronization

### 🔹 Behavioral Monitoring

* Distraction detection (tab switch / minimize)
* Focus score calculation
* Real-time warning system

### 🔹 Analytics & Insights

* Focus efficiency tracking
* Session timelines (event history)
* Behavioral insights (distraction patterns)

### 🔹 Visualization

* Analytics dashboard
* Activity heatmap
* Weekly trends & focus score graph

### 🔹 Supporting Features

* Keyboard shortcuts
* Desktop notifications
* Sound feedback
* Exportable reports

---

## 📊 Behavioral Analytics

FocusSync analyzes user behavior and provides insights such as:

* “You get distracted every ~6 minutes”
* “Focus drops after the first 10 minutes”
* Focus Level: **HIGH / MEDIUM / LOW**
* Efficiency Score: **Focus Time / Total Session Time**

---

## 📡 Socket.io Events

### Client → Server

* `join_room` → Join study session
* `start_session` → Start focus timer
* `end_session` → End session
* `distraction` → Report distraction

### Server → Client

* `session_started` → Start timer
* `session_sync` → Sync late users
* `distraction_count` → Update distractions
* `user_count` → Active users

---

## 🗄️ Data Model (Session)

```json
{
  "roomId": "abc123",
  "startTime": "Date",
  "endTime": "Date",
  "distractions": 3,
  "focusScore": 70,
  "events": [
    { "type": "start", "time": "Date" },
    { "type": "distraction", "time": "Date" }
  ]
}
```

---

## 🚀 Getting Started

### Prerequisites

* Node.js
* MongoDB (local or Atlas)

### Installation

```bash
npm run install:all
```

### Run Application

```bash
npm run dev
```

Frontend: http://localhost:3000
Backend: http://localhost:5000

---

## 🧪 Demonstration Flow (Recommended)

1. Open 2 browser tabs
2. Join same room
3. Start session
4. Observe real-time synchronization
5. Switch tab → distraction detected
6. Open dashboard → view analytics

---

## ❓ Why Not a Normal Timer?

Traditional timers:

* Client-controlled
* No synchronization
* No behavioral tracking

FocusSync:

* Server-controlled timing
* Real-time synchronization
* Behavioral analytics and insights

👉 This transforms it into a **distributed system**, not just a utility app.

---

## 🎓 Academic Value

This project demonstrates:

* Full-stack MERN development
* Real-time communication systems
* Distributed system concepts
* Browser API integration
* Data analytics and visualization

---

## 🧠 Viva One-Liner

> “FocusSync is a real-time distributed system that synchronizes user sessions using a server-authoritative architecture while analyzing behavioral patterns like distractions and focus efficiency.”

---

## 📌 Conclusion

FocusSync is not just a study tool — it is a **behavior-aware real-time system** that combines synchronization, monitoring, and analytics to improve productivity through data-driven insights.

---

## 📜 License

MIT

---

## 👨‍💻 Author

Built for Web Technologies Project 🎓
