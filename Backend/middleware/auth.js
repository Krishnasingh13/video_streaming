// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const ROLES = {
  ADMIN: 'ADMIN',
  EDITOR: 'EDITOR',
  VIEWER: 'VIEWER'
};

async function auth(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded: { id, role, iat, exp } – we'll ignore decoded.role

    const user = await User.findById(decoded.id).select('role email');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // 👇 use fresh role from DB
    req.user = {
      id: user._id.toString(),
      role: user.role,
      email: user.email,
    };

    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(401).json({ message: 'Invalid token' });
  }
}

auth.ROLES = ROLES;
module.exports = auth;
