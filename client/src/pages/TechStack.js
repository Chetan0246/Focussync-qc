// TechStack Page - Shows architecture and technologies for viva
import React from 'react';
import { Link } from 'react-router-dom';
import './TechStack.css';

function TechStack() {
  const technologies = [
    {
      category: 'Frontend',
      icon: '🎨',
      items: [
        { name: 'React 18', desc: 'UI Library' },
        { name: 'React Router', desc: 'Navigation' },
        { name: 'Socket.io Client', desc: 'Real-time communication' },
        { name: 'Axios', desc: 'HTTP requests' }
      ]
    },
    {
      category: 'Backend',
      icon: '⚙️',
      items: [
        { name: 'Node.js', desc: 'Runtime environment' },
        { name: 'Express', desc: 'Web framework' },
        { name: 'Socket.io', desc: 'WebSocket library' },
        { name: 'Mongoose', desc: 'MongoDB ODM' }
      ]
    },
    {
      category: 'Database',
      icon: '🗄️',
      items: [
        { name: 'MongoDB', desc: 'NoSQL database' },
        { name: 'Aggregation Pipeline', desc: 'Data analytics' }
      ]
    },
    {
      category: 'Browser APIs',
      icon: '🌐',
      items: [
        { name: 'Page Visibility API', desc: 'Distraction detection' },
        { name: 'Notification API', desc: 'Desktop notifications' },
        { name: 'Web Audio API', desc: 'Sound effects' },
        { name: 'LocalStorage', desc: 'Client-side storage' }
      ]
    }
  ];

  const features = [
    { icon: '⏱️', name: 'Real-time Timer', desc: 'Server-authoritative timer sync across all clients' },
    { icon: '👥', name: 'Multi-user Rooms', desc: 'Multiple users can join and study together' },
    { icon: '⚠️', name: 'Distraction Detection', desc: 'Tracks tab switches using Visibility API' },
    { icon: '📊', name: 'Analytics Dashboard', desc: 'Charts, graphs, and insights' },
    { icon: '🏆', name: 'Leaderboard', desc: 'Compete with other rooms' },
    { icon: '🔥', name: 'Heatmap', desc: 'Visualize study patterns' },
    { icon: '🎯', name: 'Achievements', desc: 'Earn badges for milestones' },
    { icon: '🔔', name: 'Notifications', desc: 'Desktop alerts for events' }
  ];

  const vivaQuestions = [
    { q: 'How does real-time sync work?', a: 'Using Socket.io WebSockets for bidirectional communication' },
    { q: 'How are distractions detected?', a: 'Page Visibility API detects when user switches tabs' },
    { q: 'Why MongoDB?', a: 'Flexible schema for session events, good for time-series data' },
    { q: 'How is timer kept in sync?', a: 'Server stores endTime, clients calculate remaining time' },
    { q: 'What happens on late join?', a: 'New users receive session_sync event with current timer state' }
  ];

  return (
    <div className="techstack">
      <div className="techstack-container">
        <div className="techstack-header">
          <h1 className="techstack-title">🚀 FocusSync - Tech Stack</h1>
          <p className="techstack-subtitle">
            A real-time collaborative study platform built with the MERN Stack
          </p>
          <Link to="/" className="btn btn-primary">← Back to Home</Link>
        </div>

        {/* Architecture Diagram */}
        <div className="section">
          <h2 className="section-title">📐 Architecture</h2>
          <div className="architecture-diagram">
            <div className="arch-box client">
              <div className="arch-icon">💻</div>
              <div className="arch-label">React Client</div>
              <div className="arch-port">Port 3000</div>
            </div>
            
            <div className="arch-arrow">
              <span>WebSocket + HTTP</span>
              <div className="arrow-line"></div>
            </div>
            
            <div className="arch-box server">
              <div className="arch-icon">⚙️</div>
              <div className="arch-label">Node.js Server</div>
              <div className="arch-port">Port 5000</div>
            </div>
            
            <div className="arch-arrow">
              <span>Mongoose</span>
              <div className="arrow-line"></div>
            </div>
            
            <div className="arch-box database">
              <div className="arch-icon">🗄️</div>
              <div className="arch-label">MongoDB</div>
              <div className="arch-port">Port 27017</div>
            </div>
          </div>
        </div>

        {/* Technologies */}
        <div className="section">
          <h2 className="section-title">🛠️ Technologies Used</h2>
          <div className="tech-grid">
            {technologies.map((tech, idx) => (
              <div key={idx} className="tech-card">
                <div className="tech-header">
                  <span className="tech-icon">{tech.icon}</span>
                  <h3 className="tech-category">{tech.category}</h3>
                </div>
                <div className="tech-items">
                  {tech.items.map((item, i) => (
                    <div key={i} className="tech-item">
                      <span className="tech-name">{item.name}</span>
                      <span className="tech-desc">{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="section">
          <h2 className="section-title">✨ Key Features</h2>
          <div className="features-grid">
            {features.map((feature, idx) => (
              <div key={idx} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-name">{feature.name}</h3>
                <p className="feature-desc">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Viva Questions */}
        <div className="section">
          <h2 className="section-title">❓ Common Viva Questions</h2>
          <div className="viva-card">
            {vivaQuestions.map((item, idx) => (
              <div key={idx} className="viva-item">
                <div className="viva-question">
                  <span className="q-icon">❓</span>
                  <strong>{item.q}</strong>
                </div>
                <div className="viva-answer">
                  <span className="a-icon">💡</span>
                  <span>{item.a}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Stats */}
        <div className="section">
          <h2 className="section-title">📈 Project Stats</h2>
          <div className="stats-grid">
            <div className="stat-box">
              <div className="stat-value">8</div>
              <div className="stat-label">React Components</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">4</div>
              <div className="stat-label">Socket Events</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">3</div>
              <div className="stat-label">REST APIs</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">100%</div>
              <div className="stat-label">JavaScript</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TechStack;
