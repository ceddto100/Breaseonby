const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getVideos,
  getFeaturedVideos,
  getPopularVideos,
  getVideo,
  createVideo,
  updateVideo,
  deleteVideo,
} = require('../controllers/videoController');

router.get('/', getVideos);
router.get('/featured', getFeaturedVideos);
router.get('/popular', getPopularVideos);
router.get('/:id', getVideo);
router.post('/', authMiddleware, createVideo);
router.put('/:id', authMiddleware, updateVideo);
router.delete('/:id', authMiddleware, deleteVideo);

module.exports = router;
