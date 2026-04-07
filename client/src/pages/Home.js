// Home Page - Entry point for users to join or create rooms
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [roomId, setRoomId] = useState('');

  // Generate a random room ID
  const generateRoomId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Handle joining an existing room
  const handleJoin = () => {
    if (roomId.trim()) {
      navigate(`/room/${roomId.trim().toUpperCase()}`);
    }
  };

  // Handle creating a new room
  const handleCreate = () => {
    const newRoomId = generateRoomId();
    navigate(`/room/${newRoomId}`);
  };

  return (
    <div className="home">
      <div className="home-container">
        {/* Hero Section */}
        <div className="hero">
          <h1 className="hero-title">
            Stay Focused, <span className="text-green">Together</span>
          </h1>
          <p className="hero-subtitle">
            {user 
              ? `Welcome back, ${user.username}! Ready to focus?`
              : 'Join a study room and sync your focus timer with others in real-time. Track distractions and improve your productivity.'
            }
          </p>
        </div>

        {/* Room Actions Card */}
        <div className="card home-card">
          <h2 className="card-title">Join or Create a Room</h2>
          
          {/* Join Room Section */}
          <div className="join-section">
            <label className="label">Enter Room ID</label>
            <div className="input-group">
              <input
                type="text"
                className="input"
                placeholder="e.g., ABC123"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
                maxLength={6}
              />
              <button className="btn btn-primary" onClick={handleJoin}>
                Join Room
              </button>
            </div>
          </div>

          <div className="divider">
            <span>OR</span>
          </div>

          {/* Create Room Section */}
          <button className="btn btn-secondary create-btn" onClick={handleCreate}>
            🎲 Create New Room
          </button>
        </div>

        {/* Features Section */}
        <div className="features">
          <div className="feature-card">
            <div className="feature-icon">⏱️</div>
            <h3>Real-time Timer</h3>
            <p>Synchronized countdown across all users in the room</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Study Together</h3>
            <p>Join friends and stay accountable as a group</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Track Progress</h3>
            <p>Monitor focus sessions and distraction patterns</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
