// Timer Component - Displays real-time countdown timer with circular progress
// Uses server-provided endTime for synchronization
import React, { useState, useEffect } from 'react';
import './Timer.css';

function Timer({ endTime, startTime, isRunning }) {
  const [timeLeft, setTimeLeft] = useState({
    minutes: 0,
    seconds: 0,
    totalSeconds: 0
  });

  // Calculate time remaining from server endTime
  useEffect(() => {
    if (!endTime || !isRunning) {
      setTimeLeft({ minutes: 0, seconds: 0, totalSeconds: 0 });
      return;
    }

    const updateTimer = () => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const diff = end - now;

      if (diff <= 0) {
        // Timer has ended
        setTimeLeft({ minutes: 0, seconds: 0, totalSeconds: 0 });
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;

      setTimeLeft({ minutes, seconds, totalSeconds });
    };

    // Update immediately and then every second
    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [endTime, isRunning]);

  // Format time as MM:SS
  const formatTime = (mins, secs) => {
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const getProgress = () => {
    if (!startTime || !endTime) return 0;
    const total = new Date(endTime).getTime() - new Date(startTime).getTime();
    const elapsed = new Date().getTime() - new Date(startTime).getTime();
    return Math.min(100, (elapsed / total) * 100);
  };

  // Calculate circular progress
  const getCircularProgress = () => {
    if (!startTime || !endTime) return 0;
    const total = new Date(endTime).getTime() - new Date(startTime).getTime();
    const elapsed = new Date().getTime() - new Date(startTime).getTime();
    return Math.min(100, (elapsed / total) * 100);
  };

  // SVG circle properties
  const radius = 150;
  const circumference = 2 * Math.PI * radius;
  const progress = getCircularProgress();
  const offset = circumference - (progress / 100) * circumference;

  // Determine if timer is ending soon (less than 2 minutes)
  const isEndingSoon = timeLeft.totalSeconds > 0 && timeLeft.totalSeconds <= 120;

  return (
    <div className="timer-container">
      {/* Circular Progress with Timer */}
      <div className="circular-progress-container">
        <svg className="circular-progress-svg" viewBox="0 0 320 320">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          <circle className="circular-progress-bg" cx="160" cy="160" r={radius} />
          <circle
            className="circular-progress-bar"
            cx="160"
            cy="160"
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="timer-display">
          <span className={`timer-text ${isEndingSoon ? 'ending-soon' : ''}`}>
            {formatTime(timeLeft.minutes, timeLeft.seconds)}
          </span>
        </div>
        <div className="glow-ring"></div>
      </div>

      {/* Progress bar (fallback) */}
      {isRunning && startTime && endTime && (
        <div className="timer-progress">
          <div
            className="timer-progress-bar"
            style={{ width: `${getProgress()}%` }}
          />
        </div>
      )}

      {/* Status indicator */}
      <div className="timer-status">
        {isRunning ? (
          <span className="status-running">Running</span>
        ) : (
          <span className="status-stopped">Not Running</span>
        )}
      </div>
    </div>
  );
}

export default Timer;
