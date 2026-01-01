const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');
const adminController = require('../controllers/adminController');

router.use(auth, requireAdmin);

router.get('/users', adminController.getAllUsers);
router.put('/users/:id/role', adminController.updateUserRole);
router.get('/videos', adminController.getAllVideos);
router.get('/summary', adminController.getSummary);
router.delete('/videos/:id', adminController.deleteVideoAdmin);

module.exports = router;
