// TechStack Page - Shows architecture and technologies for viva
// Syllabus: Section 1 - HTML5 (semantic tags, lists, headings)
// Syllabus: Section 3 - HTML5 form elements, semantic tags, graphics
// Syllabus: Section 5 - CSS3 selectors, properties, positioning
// Syllabus: Section 6 - Box model, positioning, responsive design
// Syllabus: Section 7 - Bootstrap framework, jQuery
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TechStack.css';

function TechStack() {
  // Syllabus: Section 2.5 - jQuery DOM manipulation example
  useEffect(() => {
    // jQuery: Hide/show elements on click
    // Syllabus: Section 2.5 - jQuery selectors, hide/show, animation
    if (window.jQuery) {
      // Hide all .viva-answer initially, show on click
      window.jQuery('.viva-answer').hide();
      window.jQuery('.viva-question').on('click', function() {
        window.jQuery(this).next('.viva-answer').slideToggle(300);
        window.jQuery(this).toggleClass('active');
      });
    }

    // Cleanup: restore visibility on unmount
    return () => {
      if (window.jQuery) {
        window.jQuery('.viva-answer').show();
        window.jQuery('.viva-question').off('click');
      }
    };
  }, []);

  const technologies = [
    // Syllabus: Section 7 - Bootstrap, jQuery libraries
    {
      category: 'Frontend',
      icon: '🎨',
      items: [
        { name: 'React 18', desc: 'UI Library (Components, JSX, Hooks)' },
        { name: 'Bootstrap 5', desc: 'CSS Framework (Grid, Flex, Forms)' },
        { name: 'jQuery 3.7', desc: 'DOM manipulation, animations' },
        { name: 'Socket.io Client', desc: 'Real-time WebSocket communication' },
        { name: 'Axios', desc: 'HTTP REST API calls (AJAX)' }
      ]
    },
    // Syllabus: Section 5 - Node.js, Express.js routing
    {
      category: 'Backend',
      icon: '⚙️',
      items: [
        { name: 'Node.js', desc: 'Server-side JavaScript runtime' },
        { name: 'Express', desc: 'Web framework (routing, middleware)' },
        { name: 'Socket.io', desc: 'WebSocket server (real-time)' },
        { name: 'Mongoose', desc: 'MongoDB ODM (schema, queries)' }
      ]
    },
    // Syllabus: Section 6 - NoSQL, MongoDB CRUD operations
    {
      category: 'Database',
      icon: '🗄️',
      items: [
        { name: 'MongoDB', desc: 'NoSQL document database' },
        { name: 'Mongoose', desc: 'ODM with schema validation' },
        { name: 'Aggregation', desc: 'Data analytics (group, sort, sum)' }
      ]
    },
    // Syllabus: Section 2 - JS objects, DOM, timing, events
    {
      category: 'Browser APIs',
      icon: '🌐',
      items: [
        { name: 'Page Visibility API', desc: 'Distraction detection (document.hidden)' },
        { name: 'Notification API', desc: 'Desktop alerts' },
        { name: 'Web Audio API', desc: 'Sound effects (oscillator)' },
        { name: 'LocalStorage', desc: 'Client-side key-value storage' }
      ]
    }
  ];

  // Syllabus: Section 3 - HTML5 semantic tags used throughout
  const features = [
    { icon: '⏱️', name: 'Real-time Timer', desc: 'Server-authoritative timer sync' },
    { icon: '👥', name: 'Multi-user Rooms', desc: 'Study together with Socket.io' },
    { icon: '⚠️', name: 'Distraction Detection', desc: 'Page Visibility API tracks tab switches' },
    { icon: '📊', name: 'Analytics Dashboard', desc: 'Charts, leaderboards, heatmaps' },
    { icon: '🏆', name: 'Leaderboard', desc: 'Compete with other rooms' },
    { icon: '🔥', name: 'Heatmap', desc: 'Visualize study patterns over time' },
    { icon: '🎯', name: 'Achievements', desc: 'Earn badges for milestones' },
    { icon: '🔔', name: 'Notifications', desc: 'Desktop alerts for events' }
  ];

  // Syllabus: Section 3 - JSON data format
  const vivaQuestions = [
    { q: 'How does real-time sync work?', a: 'Using Socket.io WebSockets for bidirectional client-server communication' },
    { q: 'How are distractions detected?', a: 'Page Visibility API (document.hidden) detects tab switches' },
    { q: 'Why MongoDB (NoSQL)?', a: 'Flexible schema for session events, good for time-series data, easy aggregation' },
    { q: 'How is timer kept in sync?', a: 'Server stores endTime, clients calculate remaining time locally' },
    { q: 'What happens when user joins late?', a: 'They receive session_sync event with current timer state' },
    { q: 'What is JWT?', a: 'JSON Web Token - used for authentication, stored in localStorage, sent in Authorization header' }
  ];

  return (
    <div className="techstack">
      <div className="techstack-container">
        {/* Syllabus: Section 1 - HTML5 headings (<h1>, <h2>) */}
        <header className="techstack-header">
          <h1 className="techstack-title">🚀 FocusSync - Tech Stack</h1>
          <p className="techstack-subtitle">
            MERN Stack + Socket.io + Bootstrap + jQuery
          </p>
          <Link to="/" className="btn btn-primary">← Back to Home</Link>
        </header>

        {/* Syllabus: Section 3 - HTML5 semantic <section> tags */}
        <section className="section">
          <h2 className="section-title">📐 Architecture</h2>
          <div className="architecture-diagram">
            {/* Syllabus: Section 3 - HTML5 semantic <figure> and graphics */}
            <figure className="arch-box client">
              <div className="arch-icon">💻</div>
              <figcaption className="arch-label">React Client<br /><small>Port 3000</small></figcaption>
            </figure>

            <div className="arch-arrow">
              <span>WebSocket + HTTP</span>
              <div className="arrow-line"></div>
            </div>

            <figure className="arch-box server">
              <div className="arch-icon">⚙️</div>
              <figcaption className="arch-label">Node.js + Express<br /><small>Port 5000</small></figcaption>
            </figure>

            <div className="arch-arrow">
              <span>Mongoose</span>
              <div className="arrow-line"></div>
            </div>

            <figure className="arch-box database">
              <div className="arch-icon">🗄️</div>
              <figcaption className="arch-label">MongoDB<br /><small>Port 27017</small></figcaption>
            </figure>
          </div>
        </section>

        {/* Technologies - Syllabus: Section 2.4 - DOM manipulation */}
        <section className="section">
          <h2 className="section-title">🛠️ Technologies Used</h2>
          {/* Syllabus: Section 3 - HTML5 <ul> list tags */}
          <div className="tech-grid">
            {technologies.map((tech, idx) => (
              <div key={idx} className="tech-card">
                <div className="tech-header">
                  <span className="tech-icon">{tech.icon}</span>
                  <h3 className="tech-category">{tech.category}</h3>
                </div>
                <ul className="tech-items">
                  {tech.items.map((item, i) => (
                    <li key={i} className="tech-item">
                      <strong>{item.name}</strong> — {item.desc}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="section">
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
        </section>

        {/* Viva Questions - Syllabus: Section 2.5 - jQuery hide/show */}
        <section className="section">
          <h2 className="section-title">❓ Common Viva Questions (Click to expand)</h2>
          <div className="viva-card">
            {vivaQuestions.map((item, idx) => (
              <div key={idx} className="viva-item">
                {/* jQuery handles click to toggle answer visibility */}
                <div className="viva-question">
                  <span className="q-icon">❓</span>
                  <strong>{item.q}</strong>
                  <span className="toggle-hint">▼</span>
                </div>
                <div className="viva-answer">
                  <span className="a-icon">💡</span>
                  <span>{item.a}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Project Stats */}
        <section className="section">
          <h2 className="section-title">📈 Project Stats</h2>
          {/* Syllabus: Section 3 - HTML5 <table> for data display */}
          <table className="stats-table">
            <tbody>
              <tr>
                <td><strong>8</strong> React Components</td>
                <td><strong>5</strong> Socket Events</td>
              </tr>
              <tr>
                <td><strong>5</strong> REST APIs</td>
                <td><strong>100%</strong> JavaScript</td>
              </tr>
              <tr>
                <td><strong>Bootstrap 5</strong> CSS Framework</td>
                <td><strong>jQuery 3.7</strong> DOM Library</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}

export default TechStack;
