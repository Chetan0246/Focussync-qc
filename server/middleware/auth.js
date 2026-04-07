// Authentication Middleware - Protect routes with JWT
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'focussync-secret-key-change-in-production';

const auth = (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No authentication token, access denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

module.exports = auth;
module.exports.JWT_SECRET = JWT_SECRET;
