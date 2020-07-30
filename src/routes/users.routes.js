const express = require('express');

const winston = require('../config/winston');
const User = require('../models/user.model');
const { manager } = require('../utils/trade_offer_manager');

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

router.get('/:userId/inventory', async (req, res) => {
  const user = await User.findById(
    req.params.userId,
  );
  manager.loadUserInventory(user.steamId, 570, 2, true, (err, inventory) => {
    if (err) {
      winston.error(err);
      res.json(inventory);
    } else {
      res.json({ inventory });
    }
  });
});

module.exports = router;
