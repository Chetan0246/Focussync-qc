// Room Page - Main study room with real-time timer
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import io from 'socket.io-client';
import Timer from '../components/Timer';
import './Room.css';

// Connect to backend server
const socket = io.connect(process.env.REACT_APP_API_URL || '', {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
});

// Sound effects using Web Audio API (no external files needed)
const playSound = (type) => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  if (type === 'start') {
    oscillator.frequency.value = 523.25; // C5
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } else if (type === 'end') {
    oscillator.frequency.value = 523.25;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    oscillator.start(audioContext.currentTime);
    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.2); // E5
    oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.4); // G5
    oscillator.stop(audioContext.currentTime + 0.6);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);
  } else if (type === 'distraction') {
    oscillator.frequency.value = 200;
    oscillator.type = 'sawtooth';
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  }
};

// Request desktop notification permission
const requestNotificationPermission = () => {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
};

// Send desktop notification
const sendNotification = (title, body) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico'
    });
  }
};

function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  // State for room data
  const [userCount, setUserCount] = useState(0);
  const [distractionCount, setDistractionCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [endTime, setEndTime] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [sessionDuration, setSessionDuration] = useState(25);
  
  // New state for enhanced features
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [hasJoined, setHasJoined] = useState(false);
  const [showNameInput, setShowNameInput] = useState(true);
  
  const distractionRef = useRef(false);

  // Generate random username if not provided
  const generateUsername = () => {
    const adjectives = ['Focus', 'Zen', 'Quick', 'Smart', 'Bright', 'Calm', 'Eager', 'Keen'];
    const nouns = ['Owl', 'Eagle', 'Tiger', 'Wolf', 'Bear', 'Fox', 'Hawk', 'Lion'];
    const num = Math.floor(Math.random() * 100);
    return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}${num}`;
  };

  // Join room when component mounts
  useEffect(() => {
    requestNotificationPermission();
    
    // Auto-generate username
    setUsername(generateUsername());
  }, [roomId]);

  // Handle joining with username
  const handleJoinRoom = () => {
    if (!username.trim()) return;
    
    socket.emit('join_room', { roomId, username });
    setHasJoined(true);
    setShowNameInput(false);
  };

  // Socket event listeners
  useEffect(() => {
    if (!hasJoined) return;

    // Listen for room state updates
    socket.on('room_state', (data) => {
      setUserCount(data.userCount || 0);
      setDistractionCount(data.distractionCount || 0);
      if (data.users) setUsers(data.users);
      if (data.endTime) {
        setEndTime(data.endTime);
        setStartTime(data.startTime);
        setIsRunning(true);
      }
    });

    // Listen for session started
    socket.on('session_started', (data) => {
      setStartTime(data.startTime);
      setEndTime(data.endTime);
      setIsRunning(true);
      playSound('start');
    });

    // Listen for session sync (for late joiners)
    socket.on('session_sync', (data) => {
      setStartTime(data.startTime);
      setEndTime(data.endTime);
      setIsRunning(true);
    });

    // Listen for session ended
    socket.on('session_ended', () => {
      setIsRunning(false);
      setEndTime(null);
      setStartTime(null);
      playSound('end');
      sendNotification('Session Complete! 🎉', 'Great job! Time for a break.');
    });

    // Listen for user count updates
    socket.on('user_count', (count) => {
      setUserCount(count);
    });

    // Listen for distraction count updates
    socket.on('distraction_count', (data) => {
      setDistractionCount(data.count);
      if (data.count > 0 && !distractionRef.current) {
        playSound('distraction');
        distractionRef.current = true;
        setTimeout(() => { distractionRef.current = false; }, 2000);
      }
    });

    // Listen for users list
    socket.on('users_list', (userList) => {
      setUsers(userList);
    });

    // Cleanup on unmount
    return () => {
      socket.off('room_state');
      socket.off('session_started');
      socket.off('session_sync');
      socket.off('session_ended');
      socket.off('user_count');
      socket.off('distraction_count');
      socket.off('users_list');
    };
  }, [hasJoined, roomId]);

  // Page Visibility API - Detect when user switches tabs
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isRunning) {
        socket.emit('distraction', { roomId });
        sendNotification('Distraction Detected! ⚠️', 'Stay focused! Get back to work.');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isRunning, roomId]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Don't trigger if typing in input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      // Space = Start session
      if (e.code === 'Space' && !isRunning && hasJoined) {
        e.preventDefault();
        handleStartSession();
      }
      // E = End session
      if (e.code === 'KeyE' && isRunning && hasJoined) {
        e.preventDefault();
        handleEndSession();
      }
      // D = Toggle distraction (for testing)
      if (e.code === 'KeyD' && isRunning && hasJoined) {
        socket.emit('distraction', { roomId });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isRunning, hasJoined, roomId]);

  // Start a new session
  const handleStartSession = () => {
    socket.emit('start_session', {
      roomId,
      duration: sessionDuration
    });
    playSound('start');
    sendNotification('Session Started! 🚀', `Focus for ${sessionDuration} minutes.`);
  };

  // End current session
  const handleEndSession = () => {
    socket.emit('end_session', { roomId });
  };

  // Navigate to dashboard
  const handleViewDashboard = () => {
    navigate(`/dashboard/${roomId}`);
  };

  // Show name input screen
  if (showNameInput) {
    return (
      <div className="room">
        <div className="room-container">
          <div className="join-card card">
            <h1 className="join-title">Join Room: {roomId}</h1>
            <p className="join-subtitle">Enter your name to get started</p>
            
            <input
              type="text"
              className="input"
              placeholder="Your name (e.g., John)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleJoinRoom()}
              maxLength={20}
            />
            
            <button className="btn btn-primary join-btn" onClick={handleJoinRoom}>
              Join Room
            </button>
            
            <p className="keyboard-hint">
              Press Enter to join
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="room">
      <div className="room-container">
        {/* Room Header */}
        <div className="room-header">
          <div className="room-info">
            <h1 className="room-title">Room: {roomId}</h1>
            <div className="room-stats">
              <span className="stat">
                👥 {userCount} {userCount === 1 ? 'User' : 'Users'} Online
              </span>
              <span className="stat distraction-stat">
                ⚠️ {distractionCount} {distractionCount === 1 ? 'Distraction' : 'Distractions'}
              </span>
            </div>
          </div>
          <div className="header-actions">
            <button onClick={handleViewDashboard} className="btn btn-secondary">
              📊 Dashboard
            </button>
          </div>
        </div>

        {/* Active Users */}
        <div className="card users-card">
          <h3 className="card-subtitle">👤 Active Users</h3>
          <div className="users-list">
            <span className="user-tag current">{username} (You)</span>
            {users.filter(u => u !== username).map((user, index) => (
              <span key={index} className="user-tag">{user}</span>
            ))}
            {users.length === 0 && (
              <span className="no-users">You're the only one here. Invite friends!</span>
            )}
          </div>
        </div>

        {/* Timer Section */}
        <Timer 
          endTime={endTime} 
          startTime={startTime} 
          isRunning={isRunning} 
        />

        {/* Controls Section */}
        <div className="card controls-card">
          {!isRunning ? (
            <>
              <h2 className="card-title">Start a Focus Session</h2>
              
              <div className="duration-selector">
                <label className="label">Session Duration (minutes)</label>
                <div className="duration-buttons">
                  {[15, 25, 45, 60].map((mins) => (
                    <button
                      key={mins}
                      className={`duration-btn ${sessionDuration === mins ? 'active' : ''}`}
                      onClick={() => setSessionDuration(mins)}
                    >
                      {mins} min
                    </button>
                  ))}
                </div>
              </div>

              <button 
                className="btn btn-primary start-btn" 
                onClick={handleStartSession}
              >
                🚀 Start Session (Space)
              </button>
            </>
          ) : (
            <>
              <h2 className="card-title">Session in Progress</h2>
              <p className="session-info">
                Stay focused! Switching tabs will be counted as a distraction.
              </p>
              <button 
                className="btn btn-secondary end-btn" 
                onClick={handleEndSession}
              >
                ⏹️ End Session (E)
              </button>
            </>
          )}
        </div>

        {/* Keyboard Shortcuts */}
        <div className="shortcuts-card">
          <h3>⌨️ Keyboard Shortcuts</h3>
          <div className="shortcuts-grid">
            <div className="shortcut-item">
              <kbd>Space</kbd>
              <span>Start Session</span>
            </div>
            <div className="shortcut-item">
              <kbd>E</kbd>
              <span>End Session</span>
            </div>
            <div className="shortcut-item">
              <kbd>D</kbd>
              <span>Test Distraction</span>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="tips-card">
          <h3>💡 Focus Tips</h3>
          <ul>
            <li>Keep this tab active during your session</li>
            <li>Close unnecessary browser tabs</li>
            <li>Put your phone on silent</li>
            <li>Take breaks between sessions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Room;
