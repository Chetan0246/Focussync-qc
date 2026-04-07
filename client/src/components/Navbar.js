// Navbar Component - Navigation bar for the app
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo/Brand */}
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🎯</span>
          <span className="brand-text">FocusSync</span>
        </Link>

        {/* Navigation Links */}
        <div className="navbar-links">
          <Link to="/" className="navbar-link">Home</Link>
          <Link to="/dashboard/global" className="navbar-link">Leaderboard</Link>
          <Link to="/techstack" className="navbar-link tech-link">Tech Stack</Link>
          
          {/* User Menu */}
          {user ? (
            <div className="user-menu">
              <span className="user-greeting">👤 {user.username}</span>
              <button onClick={handleLogout} className="btn btn-secondary logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-secondary">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
