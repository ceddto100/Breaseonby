const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { uploadVideo, uploadThumbnail } = require('../controllers/uploadController');
const { uploadVideo: multerVideo, uploadImage } = require('../config/cloudinary');

router.post('/video', authMiddleware, multerVideo.single('video'), uploadVideo);
router.post('/thumbnail', authMiddleware, uploadImage.single('thumbnail'), uploadThumbnail);

module.exports = router;
