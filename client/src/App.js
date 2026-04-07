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

// Redirect to /login if NOT authenticated
function PublicOnly({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen" />;
  return user ? <Navigate to="/" replace /> : children;
}

// Redirect to /login if authenticated (protect private routes)
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen" />;
  return user ? children : <Navigate to="/login" replace />;
}

// Default route: send unauthenticated users to /login, authenticated to /home
function DefaultRoute() {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen" />;
  return user ? <Navigate to="/" replace /> : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
        <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />
        <Route path="/room/:roomId" element={<PrivateRoute><Room /></PrivateRoute>} />
        <Route path="/dashboard/:roomId" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/techstack" element={<PrivateRoute><TechStack /></PrivateRoute>} />
        <Route path="*" element={<DefaultRoute />} />
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
