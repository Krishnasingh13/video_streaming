// routes/videoRoutes.js
const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const auth = require('../middleware/auth');
const { upload } = require('../config/multerConfig');

router.post('/', auth, upload.single('video'), videoController.uploadVideo);
router.get('/', auth, videoController.listVideos);
router.get('/:id', auth, videoController.getVideoById);
router.get('/:id/stream', auth, videoController.streamVideo);
router.patch('/:id', auth, videoController.updateVideo);
router.delete('/:id', auth, videoController.deleteVideo);

module.exports = router;
