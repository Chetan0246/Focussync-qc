// Leaderboard Route - Get top rooms by total focus time
const Session = require('../models/Session');

module.exports = async (req, res) => {
  try {
    const leaderboard = await Session.aggregate([
      {
        $group: {
          _id: '$roomId',
          totalFocusTime: {
            $sum: { $subtract: ['$endTime', '$startTime'] }
          },
          totalSessions: { $sum: 1 },
          avgFocusScore: { $avg: '$focusScore' }
        }
      },
      { $sort: { totalFocusTime: -1 } },
      { $limit: 10 }
    ]);
    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
