const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/authMiddleware');
const User = require('../models/User');

// GET /api/subscribers — admin only, list all subscribers
router.get('/', requireAdmin, async (req, res, next) => {
  try {
    const users = await User.find({ subscribed: true })
      .select('displayName email avatar role subscribedAt createdAt')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// GET /api/subscribers/count — public, returns subscriber count
router.get('/count', async (req, res, next) => {
  try {
    const count = await User.countDocuments({ subscribed: true });
    res.json({ count });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/subscribers/:id — admin only, remove subscriber
router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }
    user.subscribed = false;
    await user.save();
    res.json({ message: 'Subscriber removed' });
  } catch (error) {
    next(error);
  }
});

// GET /api/subscribers/export — admin only, export as CSV
router.get('/export', requireAdmin, async (req, res, next) => {
  try {
    const users = await User.find({ subscribed: true })
      .select('displayName email subscribedAt role')
      .sort({ createdAt: -1 });

    const csv = [
      'Display Name,Email,Subscribed At,Role',
      ...users.map(
        (u) =>
          `"${u.displayName}","${u.email}","${u.subscribedAt?.toISOString() || ''}","${u.role}"`
      ),
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=subscribers.csv');
    res.send(csv);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
