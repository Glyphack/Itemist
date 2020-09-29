const express = require('express');

const {User} = require('../../models/user.model');
const {getUserInventory} = require("../../utils/bot");

const router = express.Router();

router.get('', async (req, res) => {
  const user = await User.findOne({ steamId: req.user.steamId });
  res.json({
    tradeUrl: user.tradeUrl,
    wallet: user.wallet,
  });
});

router.put('', async (req, res) => {
  const user = await User.findOneAndUpdate(
    { steamId: req.user.steamId },
    { tradeUrl: req.body.trade_url },
    { new: true },
  );
  res.json({ user });
});

router.get('/inventory', async (req, res) => {
  const inventory = await getUserInventory(req.user.steamId, 570, 2, true);
  res.json({inventory});
});

module.exports = router;
