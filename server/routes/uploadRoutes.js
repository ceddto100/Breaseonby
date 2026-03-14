const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/authMiddleware');
const { uploadVideo, uploadThumbnail } = require('../controllers/uploadController');
const { uploadVideo: multerVideo, uploadImage } = require('../config/cloudinary');

router.post('/video', requireAdmin, multerVideo.single('video'), uploadVideo);
router.post('/thumbnail', requireAdmin, uploadImage.single('thumbnail'), uploadThumbnail);

module.exports = router;
