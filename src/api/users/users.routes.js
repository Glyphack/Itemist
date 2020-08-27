const express = require('express');

const winston = require('../../config/winston');
const User = require('../../models/user.model');
const isOwner = require('../../middlewares/permission');
const {steamBot} = require("../../utils/bot");

const router = express.Router();

router.get('/:steamId', isOwner, async (req, res) => {
  const user = await User.findOne({ steamId: req.params.steamId });
  res.json({
    tradeUrl: user.tradeUrl,
    wallet: user.wallet,
  });
});

router.put('/:steamId', isOwner, async (req, res) => {
  const user = await User.findOneAndUpdate(
    { steamId: req.params.steamId },
    { tradeUrl: req.body.trade_url },
    { new: true },
  );
  res.json({ user });
});

router.get('/:steamId/inventory', isOwner, async (req, res) => {
  steamBot.manager.loadUserInventory(req.params.steamId, 570, 2, true, (err, inventory) => {
    if (err) {
      winston.error(err);
    } else {
      res.json({ inventory });
    }
  });
});

module.exports = router;
