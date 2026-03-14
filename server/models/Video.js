const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  subjectName: {
    type: String,
    required: [true, 'Subject name is required'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    enum: ['Musicians', 'Athletes', 'Hustlers', 'Icons', 'Politicians'],
    required: [true, 'Category is required'],
  },
  tags: {
    type: [String],
    default: [],
  },
  cloudinaryUrl: {
    type: String,
    required: [true, 'Video URL is required'],
  },
  cloudinaryPublicId: {
    type: String,
    default: '',
  },
  thumbnailUrl: {
    type: String,
    default: '',
  },
  thumbnailPublicId: {
    type: String,
    default: '',
  },
  views: {
    type: Number,
    default: 0,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['published', 'draft'],
    default: 'published',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

videoSchema.index({ subjectName: 'text', title: 'text', tags: 'text' });

module.exports = mongoose.model('Video', videoSchema);
