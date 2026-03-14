// POST /api/upload — handles Cloudinary uploads
const ensureVideoExtension = (url) => {
  if (!url) return url;

  const [base, query = ''] = url.split('?');
  const [pathWithoutHash, hash = ''] = base.split('#');

  if (/\.[a-z0-9]{3,4}$/i.test(pathWithoutHash)) {
    return url;
  }

  const rebuilt = `${pathWithoutHash}.mp4${hash ? `#${hash}` : ''}`;
  return query ? `${rebuilt}?${query}` : rebuilt;
};

exports.uploadVideo = (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No video file provided' });
    }

    const url = ensureVideoExtension(req.file.path);

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
