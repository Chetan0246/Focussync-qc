// Session Model - Stores focus session data
const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  userId: { type: String, required: false }, // Optional: for authenticated users
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  distractions: { type: Number, default: 0 },
  focusScore: { type: Number, default: 100 },
  events: [{
    type: { type: String, required: true },
    time: { type: Date, required: true }
  }]
});

module.exports = mongoose.model('Session', sessionSchema);
