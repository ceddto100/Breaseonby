// POST /api/upload — handles Cloudinary uploads
exports.uploadVideo = (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No video file provided' });
    }
    // Ensure the URL ends with .mp4 so browsers and video players
    // can identify the resource as a playable video file.
    let url = req.file.path;
    if (!/\.\w{3,4}$/.test(url)) {
      url += '.mp4';
    }
    res.json({
      url,
      publicId: req.file.filename,
    });
  } catch (error) {
    next(error);
  }
};

exports.uploadThumbnail = (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }
    res.json({
      url: req.file.path,
      publicId: req.file.filename,
    });
  } catch (error) {
    next(error);
  }
};
