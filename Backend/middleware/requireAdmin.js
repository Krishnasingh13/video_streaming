// middleware/requireAdmin.js
module.exports = function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthenticated' });
  }

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  next();
};
