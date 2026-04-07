// Main App component with routing and auth provider
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Room from './pages/Room';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import TechStack from './pages/TechStack';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/room/:roomId" element={<Room />} />
            <Route path="/dashboard/:roomId" element={<Dashboard />} />
            <Route path="/techstack" element={<TechStack />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
