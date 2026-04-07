// Analytics Route - Get all sessions for a room
const Session = require('../models/Session');

module.exports = async (req, res) => {
  try {
    const { roomId } = req.params;

    if (!roomId) {
      return res.status(400).json({ error: 'Room ID is required' });
    }

    const sessions = await Session.find({ roomId })
      .sort({ startTime: -1 })
      .limit(100);

    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
