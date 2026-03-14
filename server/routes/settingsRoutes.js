const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/authMiddleware');
const Settings = require('../models/Settings');

// GET /api/settings — get site settings
router.get('/', async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/settings — update site settings (admin only)
router.patch('/', requireAdmin, async (req, res, next) => {
  try {
    const allowedFields = [
      'siteTagline',
      'merchStoreUrl',
      'featuredVideoOverride',
      'maintenanceMode',
      'adsensePublisherId',
      'adSlotLeaderboard',
      'adSlotRectangle',
      'adSlotSkyscraper',
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }
    updates.updatedAt = new Date();

    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(updates);
    } else {
      Object.assign(settings, updates);
      await settings.save();
    }

    res.json(settings);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
