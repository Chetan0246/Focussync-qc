// Navbar Component - Navigation bar for the app
// Syllabus: Section 7 - Bootstrap (navbar, container, grid classes)
// Syllabus: Section 7 - CSS (selectors, pseudo-classes, flexbox)
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
    // Syllabus: Section 3 - HTML5 semantic <nav> tag
    // Syllabus: Section 7 - Bootstrap navbar classes
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        {/* Logo/Brand - Syllabus: Section 3 - HTML5 semantic <nav> */}
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <span className="brand-icon me-2">🎯</span>
          <span className="brand-text fw-bold">FocusSync</span>
        </Link>

        {/* Navigation Links - Syllabus: Section 7 - Bootstrap flex utilities */}
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <Link to="/" className="nav-link-custom">Home</Link>
          <Link to="/dashboard/global" className="nav-link-custom">Leaderboard</Link>
          <Link to="/techstack" className="nav-link-custom">Tech Stack</Link>

          {/* User Menu - Syllabus: Section 2.3 - JavaScript conditionals */}
          {user ? (
            <div className="d-flex align-items-center gap-2">
              <span className="text-muted">👤 {user.username}</span>
              <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">
                Logout
              </button>
            </div>
          ) : (
            <div className="d-flex gap-2">
              <Link to="/login" className="btn btn-outline-primary btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
