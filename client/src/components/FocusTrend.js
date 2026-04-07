// Focus Score Trend Component - Line chart showing focus score over time
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area
} from 'recharts';
import './FocusTrend.css';

function FocusTrend({ sessions }) {
  // Get last 10 sessions for the chart
  const getLast10Sessions = () => {
    if (!sessions || sessions.length === 0) return [];
    
    return sessions
      .slice(0, 10)
      .reverse()
      .map((session, index) => {
        const date = new Date(session.startTime);
        return {
          id: index + 1,
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          fullDate: date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          focusScore: session.focusScore || 100,
          distractions: session.distractions || 0
        };
      });
  };

  const data = getLast10Sessions();

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const score = payload[0].value;
      let color = '#22c55e';
      let message = 'Excellent';
      
      if (score < 80) {
        color = '#3b82f6';
        message = 'Good';
      }
      if (score < 60) {
        color = '#f59e0b';
        message = 'Fair';
      }
      if (score < 40) {
        color = '#ef4444';
        message = 'Poor';
      }

      return (
        <div className="focus-tooltip">
          <p className="focus-tooltip-label">{label}</p>
          <p className="focus-tooltip-score" style={{ color }}>
            {score} - {message}
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate stats
  const avgScore = data.length > 0 
    ? Math.round(data.reduce((sum, d) => sum + d.focusScore, 0) / data.length)
    : 0;
  
  const trend = data.length >= 2 
    ? data[data.length - 1].focusScore - data[0].focusScore 
    : 0;

  if (data.length === 0) {
    return (
      <div className="focus-trend">
        <h2 className="trend-title">🎯 Focus Score Trend</h2>
        <p className="no-data">No sessions recorded yet</p>
      </div>
    );
  }

  return (
    <div className="focus-trend">
      <div className="trend-header">
        <h2 className="trend-title">🎯 Focus Score Trend</h2>
        <div className="trend-stats">
          <div className="trend-stat">
            <span className="stat-label">Average</span>
            <span className={`stat-value ${avgScore >= 80 ? 'good' : avgScore >= 60 ? 'fair' : 'poor'}`}>
              {avgScore}
            </span>
          </div>
          <div className="trend-stat">
            <span className="stat-label">Trend</span>
            <span className={`stat-value ${trend >= 0 ? 'good' : 'poor'}`}>
              {trend >= 0 ? '+' : ''}{trend}
            </span>
          </div>
        </div>
      </div>
      
      <div className="trend-chart-recharts">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="focusScore" 
              stroke="#22c55e" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorScore)" 
            />
            <Line 
              type="monotone" 
              dataKey="focusScore" 
              stroke="#22c55e" 
              strokeWidth={3}
              dot={{ fill: '#22c55e', strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, fill: '#4ade80' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Score Guide */}
      <div className="score-guide">
        <div className="guide-item">
          <span className="guide-dot good"></span>
          <span className="guide-label">80-100 Excellent</span>
        </div>
        <div className="guide-item">
          <span className="guide-dot fair"></span>
          <span className="guide-label">60-79 Good</span>
        </div>
        <div className="guide-item">
          <span className="guide-dot poor"></span>
          <span className="guide-label">0-59 Needs Work</span>
        </div>
      </div>
    </div>
  );
}

export default FocusTrend;
