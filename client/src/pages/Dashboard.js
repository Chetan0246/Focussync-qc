// Dashboard Page - Analytics and insights for study sessions
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Achievements from '../components/Achievements';
import WeeklyTrend from '../components/WeeklyTrend';
import FocusTrend from '../components/FocusTrend';
import './Dashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function Dashboard() {
  const { roomId } = useParams();
  
  // State for analytics data
  const [sessions, setSessions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [heatmap, setHeatmap] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all analytics data on mount
  useEffect(() => {
    fetchData();
  }, [roomId]);

  const fetchData = async () => {
    try {
      // Fetch sessions for this room
      const sessionsRes = await axios.get(`${API_URL}/api/analytics/${roomId}`);
      setSessions(sessionsRes.data || []);

      // Fetch global leaderboard
      const leaderboardRes = await axios.get(`${API_URL}/api/leaderboard`);
      setLeaderboard(leaderboardRes.data || []);

      // Fetch heatmap data
      const heatmapRes = await axios.get(`${API_URL}/api/heatmap`);
      setHeatmap(heatmapRes.data || []);

      setLoading(false);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setLoading(false);
    }
  };

  // Load demo data for presentation
  const loadDemoData = async () => {
    setLoading(true);
    
    // Generate demo sessions
    const demoSessions = [];
    const today = new Date();
    
    // Create 15 demo sessions over past 10 days
    for (let i = 0; i < 15; i++) {
      const daysAgo = Math.floor(Math.random() * 10);
      const sessionDate = new Date(today);
      sessionDate.setDate(sessionDate.getDate() - daysAgo);
      sessionDate.setHours(Math.floor(Math.random() * 12) + 8, 0, 0, 0);
      
      const duration = [15, 25, 45, 60][Math.floor(Math.random() * 4)];
      const startTime = new Date(sessionDate);
      const endTime = new Date(startTime.getTime() + duration * 60 * 1000);
      
      const distractions = Math.floor(Math.random() * 4);
      const focusScore = Math.max(0, 100 - (distractions * 10));
      
      const events = [
        { type: 'start', time: startTime.toISOString() }
      ];
      
      if (distractions > 0) {
        for (let j = 0; j < distractions; j++) {
          const distractionTime = new Date(startTime.getTime() + (j + 1) * 5 * 60 * 1000);
          events.push({ type: 'distraction', time: distractionTime.toISOString() });
        }
      }
      
      events.push({ type: 'end', time: endTime.toISOString() });
      
      demoSessions.push({
        _id: `demo_${i}`,
        roomId: roomId === 'global' ? `ROOM${Math.floor(Math.random() * 5) + 1}` : roomId,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        distractions,
        focusScore,
        events
      });
    }
    
    setSessions(demoSessions);
    
    // Generate demo leaderboard
    const demoLeaderboard = [
      { _id: roomId === 'global' ? 'ROOM1' : roomId, totalFocusTime: 1800000, totalSessions: 25, avgFocusScore: 85 },
      { _id: 'ROOM2', totalFocusTime: 1500000, totalSessions: 20, avgFocusScore: 78 },
      { _id: 'ROOM3', totalFocusTime: 1200000, totalSessions: 18, avgFocusScore: 92 },
      { _id: 'ROOM4', totalFocusTime: 900000, totalSessions: 12, avgFocusScore: 70 },
      { _id: 'ROOM5', totalFocusTime: 600000, totalSessions: 8, avgFocusScore: 88 },
    ];
    setLeaderboard(demoLeaderboard);
    
    // Generate demo heatmap
    const demoHeatmap = [];
    for (let i = 9; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      demoHeatmap.push({
        _id: dateStr,
        sessionCount: Math.floor(Math.random() * 8),
        totalFocusTime: Math.floor(Math.random() * 3000000)
      });
    }
    setHeatmap(demoHeatmap);
    
    setLoading(false);
  };

  // Calculate summary statistics
  const calculateStats = () => {
    if (!sessions || sessions.length === 0) {
      return {
        totalSessions: 0,
        totalFocusTime: 0,
        totalDistractions: 0,
        avgFocusScore: 0
      };
    }

    const totalSessions = sessions.length;
    const totalDistractions = sessions.reduce((sum, s) => sum + (s.distractions || 0), 0);
    const avgFocusScore = sessions.reduce((sum, s) => sum + (s.focusScore || 100), 0) / totalSessions;
    
    // Calculate total focus time in minutes
    let totalFocusTime = 0;
    sessions.forEach(s => {
      if (s.startTime && s.endTime) {
        const diff = new Date(s.endTime) - new Date(s.startTime);
        totalFocusTime += diff / (1000 * 60);
      }
    });

    return {
      totalSessions,
      totalFocusTime: Math.round(totalFocusTime),
      totalDistractions,
      avgFocusScore: Math.round(avgFocusScore)
    };
  };

  const stats = calculateStats();

  // Get focus insight message based on score
  const getFocusInsight = (score) => {
    if (score >= 80) {
      return { message: "Excellent focus! You're doing great! 🌟", color: "#22c55e" };
    } else if (score >= 60) {
      return { message: "Good focus, but there's room for improvement. 👍", color: "#3b82f6" };
    } else if (score >= 40) {
      return { message: "Watch out for distractions! Try to stay focused. ⚠️", color: "#f59e0b" };
    } else {
      return { message: "Too many distractions! Minimize interruptions. 🚨", color: "#ef4444" };
    }
  };

  const insight = getFocusInsight(stats.avgFocusScore);

  // Get latest session events for timeline
  const getLatestEvents = () => {
    if (!sessions || sessions.length === 0) return [];
    return sessions[0].events || [];
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format duration in minutes
  const formatDuration = (ms) => {
    if (!ms) return '0 min';
    const minutes = Math.round(ms / (1000 * 60));
    return `${minutes} min`;
  };

  // Export session report
  const exportReport = () => {
    const report = `FocusSync Report
====================
Room: ${roomId}
Generated: ${new Date().toLocaleString()}

Summary Statistics:
- Total Sessions: ${stats.totalSessions}
- Total Focus Time: ${stats.totalFocusTime} minutes
- Total Distractions: ${stats.totalDistractions}
- Average Focus Score: ${stats.avgFocusScore}%

Insight: ${insight.message}

Session Details:
${sessions.map((s, i) => `
Session ${i + 1}:
  Date: ${formatDate(s.startTime)}
  Duration: ${formatDuration(new Date(s.endTime) - new Date(s.startTime))}
  Distractions: ${s.distractions}
  Focus Score: ${s.focusScore}
`).join('\n')}
`;
    
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `focussync-report-${roomId}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            {roomId === 'global' ? 'Global Leaderboard' : `Dashboard - Room ${roomId}`}
          </h1>
          <div className="dashboard-actions">
            <button onClick={loadDemoData} className="btn btn-secondary">
              📦 Load Demo Data
            </button>
            <button onClick={exportReport} className="btn btn-secondary">
              📥 Export Report
            </button>
          </div>
        </div>

        {/* Section 1: Summary Stats */}
        <div className="section">
          <h2 className="section-title">📊 Summary Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{stats.totalSessions}</div>
              <div className="stat-label">Total Sessions</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.totalFocusTime}</div>
              <div className="stat-label">Total Focus Time (min)</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.totalDistractions}</div>
              <div className="stat-label">Total Distractions</div>
            </div>
          </div>
        </div>

        {/* Section 2: Focus Score + Insight */}
        <div className="section">
          <h2 className="section-title">🎯 Focus Score & Insight</h2>
          <div className="focus-card">
            <div className="focus-score-display">
              <div className="score-circle" style={{ borderColor: insight.color }}>
                <span className="score-number" style={{ color: insight.color }}>
                  {stats.avgFocusScore}
                </span>
              </div>
              <div className="score-label">Average Focus Score</div>
            </div>
            <div className="focus-insight" style={{ 
              backgroundColor: `${insight.color}20`,
              borderLeft: `4px solid ${insight.color}`
            }}>
              <p>{insight.message}</p>
            </div>
          </div>
        </div>

        {/* Section 3: Weekly Trend */}
        <div className="section">
          <WeeklyTrend sessions={sessions} />
        </div>

        {/* Section 4: Focus Score Trend */}
        <div className="section">
          <FocusTrend sessions={sessions} />
        </div>

        {/* Section 5: Achievements */}
        <div className="section">
          <Achievements stats={stats} />
        </div>

        {/* Section 5: Session Timeline */}
        <div className="section">
          <h2 className="section-title">📅 Latest Session Timeline</h2>
          <div className="timeline-card">
            {sessions.length > 0 ? (
              <div className="timeline">
                {getLatestEvents().map((event, index) => (
                  <div key={index} className={`timeline-item event-${event.type}`}>
                    <div className="timeline-dot" />
                    <div className="timeline-content">
                      <div className="timeline-type">{event.type}</div>
                      <div className="timeline-time">{formatDate(event.time)}</div>
                    </div>
                  </div>
                ))}
                {getLatestEvents().length === 0 && (
                  <p className="no-data">No events recorded yet</p>
                )}
              </div>
            ) : (
              <p className="no-data">No sessions recorded yet. Click "Load Demo Data" to see examples.</p>
            )}
          </div>
        </div>

        {/* Section 6: Leaderboard */}
        <div className="section">
          <h2 className="section-title">🏆 Room Leaderboard</h2>
          <div className="leaderboard-card">
            {leaderboard.length > 0 ? (
              <table className="leaderboard-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Room ID</th>
                    <th>Total Focus Time</th>
                    <th>Sessions</th>
                    <th>Avg Score</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((room, index) => (
                    <tr key={room._id}>
                      <td>
                        <span className={`rank rank-${index + 1}`}>
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                        </span>
                      </td>
                      <td className="room-id">{room._id}</td>
                      <td>{formatDuration(room.totalFocusTime)}</td>
                      <td>{room.totalSessions}</td>
                      <td>
                        <span className="score-badge">{Math.round(room.avgFocusScore)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-data">No rooms recorded yet</p>
            )}
          </div>
        </div>

        {/* Section 7: Heatmap */}
        <div className="section">
          <h2 className="section-title">🔥 Activity Heatmap</h2>
          <div className="heatmap-card">
            {heatmap.length > 0 ? (
              <div className="heatmap-grid">
                {heatmap.map((day, index) => (
                  <div 
                    key={index} 
                    className="heatmap-cell"
                    style={{
                      backgroundColor: getHeatmapColor(day.sessionCount)
                    }}
                    title={`${day._id}: ${day.sessionCount} sessions`}
                  >
                    <div className="heatmap-date">{day._id.slice(5)}</div>
                    <div className="heatmap-count">{day.sessionCount}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No activity data yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to get heatmap cell color based on session count
function getHeatmapColor(count) {
  if (count === 0) return '#1e293b';
  if (count <= 2) return '#22c55e40';
  if (count <= 5) return '#22c55e80';
  if (count <= 10) return '#22c55ec0';
  return '#22c55e';
}

export default Dashboard;
