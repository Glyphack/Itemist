const express = require('express');
const User = require('../models/user.model');

const router = express.Router();

router.get('/:userId', async (req, res) => {
  const user = await User.findOne({ steamId: req.user.steam_id });
  res.json({ tradeUrl: user.tradeUrl });
});

router.put('/:userId', async (req, res) => {
  const user = await User.findOneAndUpdate(
    { steamId: req.user.steamId },
    { tradeUrl: req.body.trade_url },
    { new: true },
  );
  res.json({ user });
});

module.exports = router;
