const Video = require('../models/Video');
const { cloudinary } = require('../config/cloudinary');

// GET /api/videos — all videos with optional filters
exports.getVideos = async (req, res, next) => {
  try {
    const { category, sort, search, page = 1, limit = 12 } = req.query;
    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'views') {
      sortOption = { views: -1 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Video.countDocuments(query);
    const videos = await Video.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      videos,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/videos/featured
exports.getFeaturedVideos = async (req, res, next) => {
  try {
    const videos = await Video.find({ featured: true }).sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    next(error);
  }
};

// GET /api/videos/popular
exports.getPopularVideos = async (req, res, next) => {
  try {
    const videos = await Video.find().sort({ views: -1 }).limit(10);
    res.json(videos);
  } catch (error) {
    next(error);
  }
};

// GET /api/videos/:id — single video + increment views
exports.getVideo = async (req, res, next) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    res.json(video);
  } catch (error) {
    next(error);
  }
};

// POST /api/videos — create video (admin only)
exports.createVideo = async (req, res, next) => {
  try {
    const video = await Video.create(req.body);
    res.status(201).json(video);
  } catch (error) {
    next(error);
  }
};

// PUT /api/videos/:id — update video (admin only)
exports.updateVideo = async (req, res, next) => {
  try {
    const video = await Video.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    res.json(video);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/videos/:id — delete video (admin only)
exports.deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Delete from Cloudinary if public IDs exist
    if (video.cloudinaryPublicId) {
      await cloudinary.uploader.destroy(video.cloudinaryPublicId, {
        resource_type: 'video',
      });
    }
    if (video.thumbnailPublicId) {
      await cloudinary.uploader.destroy(video.thumbnailPublicId);
    }

    await Video.findByIdAndDelete(req.params.id);
    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    next(error);
  }
};
