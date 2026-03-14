const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/authMiddleware');
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
router.post('/', requireAdmin, createVideo);
router.put('/:id', requireAdmin, updateVideo);
router.delete('/:id', requireAdmin, deleteVideo);

module.exports = router;
