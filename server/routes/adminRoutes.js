const express = require('express');
const router = express.Router();
const { login } = require('../controllers/adminController');
const { requireAdmin } = require('../middleware/authMiddleware');
const Video = require('../models/Video');
const User = require('../models/User');

// POST /api/admin/login — legacy admin login
router.post('/login', login);

// GET /api/admin/stats — dashboard statistics
router.get('/stats', requireAdmin, async (req, res, next) => {
  try {
    const [totalVideos, totalSubscribers, videos] = await Promise.all([
      Video.countDocuments(),
      User.countDocuments({ subscribed: true }),
      Video.find().sort({ createdAt: -1 }).select('title subjectName views featured createdAt'),
    ]);

    const totalViews = videos.reduce((sum, v) => sum + (v.views || 0), 0);
    const featuredVideo = videos.find((v) => v.featured);
    const recentVideos = videos.slice(0, 5);

    const recentSubscribers = await User.find({ subscribed: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('displayName email avatar createdAt');

    // Views over last 30 days (approximation using video creation dates)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const topVideos = await Video.find()
      .sort({ views: -1 })
      .limit(5)
      .select('subjectName views');

    res.json({
      totalVideos,
      totalViews,
      totalSubscribers,
      featuredVideo: featuredVideo?.title || null,
      recentVideos,
      recentSubscribers,
      topVideos,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
