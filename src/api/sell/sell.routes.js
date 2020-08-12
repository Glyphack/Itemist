const express = require('express');
const SellOrder = require('../../models/sellOrder.model');
const {User} = require('../../models/user.model');
const { manager } = require('../../utils/trade_offer_manager');
const winston = require('../../config/winston');
const { editSellOrder } = require('./sell.controllers');

const router = express.Router();

router.get('/', async (req, res) => {
  const user = await User.findOne({ steamId: req.user.steamId });
  const sellOrders = await SellOrder.find({ seller: user });
  res.send(sellOrders);
});

router.put('/', editSellOrder);

router.post('/', async (req, res) => {
  const appId = req.body.app_id;
  const contextId = req.body.context_id;
  const assetId = req.body.asset_id;
  const { price } = req.body;

  manager.getUserInventoryContents(
    req.user.steamId,
    appId,
    contextId,
    true,
    async (err, inventory) => {
      if (err) {
        winston.log(err);
      } else {
        const item = inventory.find((i) => i.assetid === assetId);
        const user = await User.findOne({ steamId: req.user.steamId });
        try {
          const sellOrder = await SellOrder.create({
            seller: user,
            price,
            appId: item.appid,
            contextId: item.contextid,
            assetId: item.assetid,
          });
          res.json(sellOrder);
        } catch (error) {
          res.statusCode = 400;
          res.json({ detail: 'already submitted for sell' });
        }
      }
      // TODO: send trade offer
    },
  );
});
module.exports = router;
