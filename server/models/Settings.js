const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  siteTagline: {
    type: String,
    default: 'Every life has a story. We find it.',
  },
  merchStoreUrl: {
    type: String,
    default: '',
  },
  featuredVideoOverride: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
    default: null,
  },
  maintenanceMode: {
    type: Boolean,
    default: false,
  },
  adsensePublisherId: {
    type: String,
    default: '',
  },
  adSlotLeaderboard: {
    type: String,
    default: '',
  },
  adSlotRectangle: {
    type: String,
    default: '',
  },
  adSlotSkyscraper: {
    type: String,
    default: '',
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Settings', settingsSchema);
