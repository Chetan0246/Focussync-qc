// Achievement Badges Component - Shows earned badges based on user performance
import React from 'react';
import './Achievements.css';

function Achievements({ stats }) {
  // Define all possible badges with conditions
  const badges = [
    {
      id: 'first_session',
      name: 'First Steps',
      description: 'Complete your first session',
      icon: '🎯',
      condition: stats.totalSessions >= 1
    },
    {
      id: 'focus_master',
      name: 'Focus Master',
      description: 'Achieve 90+ average focus score',
      icon: '👑',
      condition: stats.avgFocusScore >= 90
    },
    {
      id: 'dedicated',
      name: 'Dedicated',
      description: 'Complete 10+ hours of focus time',
      icon: '🔥',
      condition: stats.totalFocusTime >= 600
    },
    {
      id: 'distraction_free',
      name: 'Zen Master',
      description: 'Complete a session with 0 distractions',
      icon: '💎',
      condition: stats.totalDistractions === 0 && stats.totalSessions > 0
    },
    {
      id: 'marathon',
      name: 'Marathon',
      description: 'Complete 50+ sessions',
      icon: '🏃',
      condition: stats.totalSessions >= 50
    },
    {
      id: 'consistent',
      name: 'Consistent',
      description: 'Study for 7 days in a row',
      icon: '📅',
      condition: stats.totalSessions >= 7
    },
    {
      id: 'night_owl',
      name: 'Night Owl',
      description: 'Study after midnight',
      icon: '🦉',
      condition: stats.totalSessions >= 1
    },
    {
      id: 'early_bird',
      name: 'Early Bird',
      description: 'Study before 6 AM',
      icon: '🌅',
      condition: stats.totalSessions >= 1
    }
  ];

  // Separate earned and locked badges
  const earned = badges.filter(b => b.condition);
  const locked = badges.filter(b => !b.condition);

  return (
    <div className="achievements">
      <h2 className="achievements-title">🏆 Achievements</h2>
      
      {/* Earned Badges */}
      <div className="badges-section">
        <h3 className="section-subtitle">
          Earned ({earned.length}/{badges.length})
        </h3>
        <div className="badges-grid">
          {earned.map(badge => (
            <div key={badge.id} className="badge earned">
              <div className="badge-icon">{badge.icon}</div>
              <div className="badge-name">{badge.name}</div>
              <div className="badge-description">{badge.description}</div>
            </div>
          ))}
          {earned.length === 0 && (
            <p className="no-badges">Complete sessions to earn badges!</p>
          )}
        </div>
      </div>

      {/* Locked Badges */}
      {locked.length > 0 && (
        <div className="badges-section">
          <h3 className="section-subtitle">Locked</h3>
          <div className="badges-grid">
            {locked.map(badge => (
              <div key={badge.id} className="badge locked">
                <div className="badge-icon">🔒</div>
                <div className="badge-name">{badge.name}</div>
                <div className="badge-description">{badge.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Achievements;
