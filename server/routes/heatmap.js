// Heatmap Route - Get sessions grouped by date
const Session = require('../models/Session');

module.exports = async (req, res) => {
  try {
    const heatmap = await Session.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$startTime' }
          },
          sessionCount: { $sum: 1 },
          totalFocusTime: {
            $sum: { $subtract: ['$endTime', '$startTime'] }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    res.json(heatmap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
