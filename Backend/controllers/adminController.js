const User = require('../models/User');
const Video = require('../models/Video');
const fs = require('fs');
const path = require('path');
const { VIDEO_UPLOAD_DIR } = require('../config/multerConfig');


// GET /api/admin/users
// List all users (no passwords)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
    return res.json({ users });
  } catch (err) {
    console.error('getAllUsers error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// PATCH /api/admin/users/:id/role
// Change user role BETWEEN VIEWER and EDITOR
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Only allow viewer/editor as per your requirement
    const allowedRoles = ['VIEWER', 'EDITOR'];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message: 'Invalid role. Only VIEWER and EDITOR are allowed from this endpoint.',
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Optional: protect admins from being downgraded here
    if (user.role === 'ADMIN') {
      return res.status(403).json({
        message: 'Cannot change role of ADMIN from this endpoint',
      });
    }

    user.role = role;
    await user.save();

    const userSafe = user.toObject();
    delete userSafe.passwordHash;

    
    const io = req.app.get('io');
    if (io) {
      io.to(`user-${user._id.toString()}`).emit('roleUpdated', {
        userId: user._id.toString(),
        newRole: user.role,
      });
    }

    return res.json({
      message: 'User role updated successfully',
      user: userSafe,
    });
  } catch (err) {
    console.error('updateUserRole error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/admin/videos
// List all videos with filters and uploader info
exports.getAllVideos = async (req, res) => {
  try {
    const { status, sensitivity, search, fromDate, toDate, page = 1, limit = 20 } = req.query;

    const query = {};

    if (status) query.status = status;
    if (sensitivity) query.sensitivityStatus = sensitivity;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) query.createdAt.$gte = new Date(fromDate);
      if (toDate) query.createdAt.$lte = new Date(toDate);
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const [videos, total] = await Promise.all([
      Video.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate('uploadUser', 'email name role'),
      Video.countDocuments(query),
    ]);

    return res.json({
      data: videos,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    console.error('getAllVideos error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/admin/videos/:id
// delete any video + remove file from storage
exports.deleteVideoAdmin = async (req, res) => {
  try {
    const adminUser = req.user; // assuming auth middleware attaches this
    const { id } = req.params;

    // Optional: extra security – only ADMIN can hit this
    if (!adminUser || !['ADMIN'].includes(adminUser.role)) {
      return res.status(403).json({ message: 'Not authorised to delete videos as admin' });
    }

    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Delete file from disk if it exists
    if (video.storedFilename) {
      const filePath = path.join(VIDEO_UPLOAD_DIR, video.storedFilename);
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, () => { /* ignore callback error */ });
      }
    }

    await video.deleteOne();

    return res.json({ message: 'Video deleted successfully' });
  } catch (err) {
    console.error('deleteVideoAdmin error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};



// OPTIONAL: GET /api/admin/summary
exports.getSummary = async (req, res) => {
  try {
    const [totalUsers, totalVideos] = await Promise.all([
      User.countDocuments(),
      Video.countDocuments(),
    ]);

    return res.json({
      totalUsers,
      totalVideos,
    });
  } catch (err) {
    console.error('getSummary error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};


