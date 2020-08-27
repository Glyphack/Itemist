const express = require('express');
const SellOrder = require('../../models/sellOrder.model');
const {User} = require('../../models/user.model');
const {logger} = require('../../config/winston');
const {steamBot} = require("../../utils/bot");
const {editSellOrder} = require('./sell.controllers');

const router = express.Router();

router.get('/', async (req, res) => {
  const user = await User.findOne({steamId: req.user.steamId});
  const sellOrders = await SellOrder.find({seller: user});
  res.send(sellOrders);
});

router.put('/', editSellOrder);

router.post('/', async (req, res) => {
  const appId = req.body.app_id;
  const contextId = req.body.context_id;
  const assetId = req.body.asset_id;
  const {price} = req.body;

  steamBot.getUserInventory(
    req.user.steamId,
    appId,
    contextId,
    true,
    async (err, inventory) => {
      if (err) {
        logger.error(err);
        res.status(500).send();
      } else {
        const item = inventory.find((i) => i.assetid === assetId);
        const user = await User.findOne({steamId: req.user.steamId});
        try {
          const sellOrder = await SellOrder.create({
            seller: user,
            price,
            appId: item.appid,
            contextId: item.contextid,
            assetId: item.assetid,
          });
          steamBot.sendDepositTrade(req.user.steamId, item.assetid, (err, success, offerId) => {
            if (err) {
              console.error(err, success);
            } else {
              logger.info({success, offerId})
            }
          });
          res.json({sellOrder});
        } catch (error) {
          res.statusCode = 400;
          res.json({detail: 'already submitted for sell'});
        }
      }
      // TODO: send trade offer
    },
  );
});
module.exports = router;
