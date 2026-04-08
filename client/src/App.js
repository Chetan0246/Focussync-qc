// Main App component with routing and auth provider
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Room from './pages/Room';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import TechStack from './pages/TechStack';

// Redirect authenticated users away from login/register
function PublicOnly({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen" />;
  return user ? <Navigate to="/" replace /> : children;
}

// Redirect unauthenticated users to login
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen" />;
  return user ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Home is public — guests can see landing page */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
        <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />
        {/* Room, Dashboard, TechStack require login */}
        <Route path="/room/:roomId" element={<PrivateRoute><Room /></PrivateRoute>} />
        <Route path="/dashboard/:roomId" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/techstack" element={<PrivateRoute><TechStack /></PrivateRoute>} />
        {/* Catch-all: send to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <AppRoutes />
      </div>
    </AuthProvider>
  );
}

export default App;
