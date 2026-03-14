const Subscriber = require('../models/Subscriber');

// POST /api/subscribe
exports.subscribe = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const existing = await Subscriber.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'Email already subscribed' });
    }

    await Subscriber.create({ email });
    res.status(201).json({ message: "YOU'RE IN. STAY UNCOVERED." });
  } catch (error) {
    next(error);
  }
};
