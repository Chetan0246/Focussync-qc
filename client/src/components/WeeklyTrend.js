// Weekly Trend Graph Component - Using Recharts for better visualization
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import './WeeklyTrend.css';

function WeeklyTrend({ sessions }) {
  // Calculate focus time for last 7 days
  const getLast7Days = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Calculate total focus time for this date
      let focusTime = 0;
      sessions.forEach(session => {
        const sessionDate = new Date(session.startTime).toISOString().split('T')[0];
        if (sessionDate === dateStr && session.startTime && session.endTime) {
          focusTime += (new Date(session.endTime) - new Date(session.startTime)) / (1000 * 60);
        }
      });
      
      days.push({
        date: dateStr,
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        fullDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        focusTime: Math.round(focusTime),
        isToday: i === 0
      });
    }
    
    return days;
  };

  const data = getLast7Days();

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          <p className="tooltip-value">{payload[0].value} minutes</p>
        </div>
      );
    }
    return null;
  };

  // Calculate summary
  const totalFocusTime = data.reduce((sum, d) => sum + d.focusTime, 0);
  const avgFocusTime = Math.round(totalFocusTime / 7);
  const bestDay = data.reduce((max, d) => d.focusTime > max.focusTime ? d : max, data[0]);

  return (
    <div className="weekly-trend">
      <h2 className="trend-title">📈 Weekly Focus Trend</h2>
      
      <div className="trend-chart-recharts">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="day" 
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
              label={{ value: 'Minutes', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="focusTime" 
              radius={[6, 6, 0, 0]}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.isToday ? '#3b82f6' : '#22c55e'}
                  style={{
                    filter: entry.isToday ? 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))' : 'none'
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary */}
      <div className="trend-summary">
        <div className="summary-item">
          <span className="summary-label">Total this week</span>
          <span className="summary-value">{totalFocusTime} min</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Daily average</span>
          <span className="summary-value">{avgFocusTime} min</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Best day</span>
          <span className="summary-value">{bestDay.day}</span>
        </div>
      </div>
    </div>
  );
}

export default WeeklyTrend;
