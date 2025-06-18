const express = require('express');
const router = express.Router();
const PushSubscription = require('../models/PushSubscription.model');
const auth = require('../middleware/auth'); // Your JWT auth middleware

router.post('/subscribe', auth, async (req, res) => {
  try {
    const { subscription } = req.body;
    const userId = req.user._id;

    // Upsert: update if exists, insert if not
    await PushSubscription.findOneAndUpdate(
      { userId },
      { subscription },
      { upsert: true, new: true }
    );

    res.status(201).json({ message: 'Subscription saved' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save subscription' });
  }
});

module.exports = router;