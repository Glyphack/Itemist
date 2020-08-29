const express = require('express');
const SellOrder = require('../../models/sellOrder.model');
const {sendDepositTrade} = require("../../utils/bot");
const {getUserInventory} = require("../../utils/bot");
const {User} = require('../../models/user.model');
const {logger} = require('../../config/winston');
const {editSellOrder} = require('./sell.controllers');

const router = express.Router();

router.get('/', async (req, res) => {
  const user = await User.findOne({steamId: req.user.steamId});
  const sellOrders = await SellOrder.find({seller: user});
  res.send(sellOrders);
});

router.put('/', editSellOrder);

router.post('/', async (req, res) => {
  const price = req.body.price;
  const appId = req.body.appId;
  const contextId = req.body.contextId;
  const assetId = req.body.assetId;

  const inventory = await getUserInventory(req.user.steamId, appId, contextId, true);
  const item = inventory.find((i) => i.assetid === assetId);
  const user = await User.findOne({steamId: req.user.steamId});
  let sellOrder = undefined;
  try {
    sellOrder = await SellOrder.create({
      seller: user,
      price,
      appId: item.appid,
      contextId: item.contextid,
      assetId: item.assetid,
    });
  } catch (error) {
    logger.error(error);
    res.statusCode = 400;
    res.json({detail: 'already submitted for sell'});
    return;
  }
  sendDepositTrade(req.user.steamId, item.assetid, (err, success, offerId) => {
    if (err) {
      logger.error(`TradeError: ${err}`);
    } else {
      logger.info({success, offerId});
      res.json({sellOrder, success, offerId});
    }
  });

});
module.exports = router;
