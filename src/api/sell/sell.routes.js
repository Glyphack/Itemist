const express = require('express');
const {SellOrder} = require('../../models/sellOrder.model');
const {TradeOffer} = require("../../models/tradeOffer.model");
const {sendDepositTrade, getUserInventory} = require("../../utils/bot");
const {User} = require('../../models/user.model');
const {logger} = require('../../utils/winston');
const {editSellOrder} = require('./sell.controllers');

const router = express.Router();

router.get('/', async (req, res) => {
  const user = await User.findOne({steamId: req.user.steamId});
  const sellOrders = await SellOrder.find({seller: user});
  res.send(sellOrders);
});

router.put('/', editSellOrder);

router.post('/', async (req, res, next) => {
  const price = req.body.price;
  const appId = req.body.appId;
  const contextId = req.body.contextId;
  const assetId = req.body.assetId;

  const inventory = await getUserInventory(req.user.steamId, appId, contextId, true).catch((err => {
    logger.error(`could not fetch inventory ${err}`)
    next(err)
  }));
  const item = inventory.find((i) => i.assetid === assetId);
  if (item === undefined) {
    res.status(400).json({detail: 'this item does not exists in your inventory'});
  }

  const user = await User.findOne({steamId: req.user.steamId});
  let sellOrder = await SellOrder.create({
    seller: user,
    price,
    appId: item.appid,
    contextId: item.contextid,
    assetId: item.assetid,
  }).catch(err => {
    logger.error(`create sell order error: ${err}`)
    next(err)
  });

  sendDepositTrade(req.user.steamId, item.assetid, async (err, success, offerId) => {
    if (err) {
      logger.error(`sendDepositTradeErro : ${err}`);
      res.status(503)
    }
    sellOrder.tradeOffer = await TradeOffer.create({
      offerId: offerId,
      user: user
    }).catch(error => {
      logger.error(`cannot create tradeOffer ${error}`)
      next(error)
    });
    sellOrder.save();
    res.json({sellOrder, success, offerId});
  });
});
module.exports = router;
