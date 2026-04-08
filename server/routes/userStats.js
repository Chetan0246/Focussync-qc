// User Stats Route - Get user-specific statistics
const Session = require('../models/Session');

module.exports = async (req, res) => {
  try {
    // Use userId from JWT token, not from URL params (prevents auth bypass)
    const userId = req.userId;

    const stats = await Session.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          totalSessions: { $sum: 1 },
          totalFocusTime: {
            $sum: { $subtract: ['$endTime', '$startTime'] }
          },
          avgFocusScore: { $avg: '$focusScore' },
          totalDistractions: { $sum: '$distractions' }
        }
      }
    ]);

    const result = stats[0] || {
      totalSessions: 0,
      totalFocusTime: 0,
      avgFocusScore: 0,
      totalDistractions: 0,
    };

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
