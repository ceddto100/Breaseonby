const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'uncovered/videos',
    resource_type: 'video',
    allowed_formats: ['mp4', 'mov', 'avi', 'mkv', 'webm'],
  },
});

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'uncovered/thumbnails',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1280, height: 720, crop: 'fill' }],
  },
});

const uploadVideo = multer({ storage: videoStorage });
const uploadImage = multer({ storage: imageStorage });

module.exports = { cloudinary, uploadVideo, uploadImage };
