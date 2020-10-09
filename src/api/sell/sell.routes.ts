import express from 'express';
import TradeOffer from '../../models/tradeOffer.model';
import User from '../../models/user.model';
import logger from '../../utils/winston';
import editSellOrder from './sell.controllers';
import { sendDepositTrade, getUserInventory } from '../../utils/bot';
import SellOrderModel from '../../models/sellOrder.model';
import { AuthenticatedRequest } from '../../types/request';

const router = express.Router();

router.get('/', async (req: AuthenticatedRequest, res) => {
  const user = await User.findOne({ steamId: req.user.steamId });
  const sellOrders = await SellOrderModel.find({ seller: user }).populate({
    path: 'tradeOffer',
    model: 'TradeOffer',
    select: 'offerId tradeStatus',
  }).exec();
  res.send(sellOrders);
});

router.put('/', editSellOrder);

router.post('/', async (req: AuthenticatedRequest, res, next) => {
  const { price } = req.body;
  const { appId } = req.body;
  const { contextId } = req.body;
  const { assetId } = req.body;

  const inventory = await getUserInventory(
    req.user.steamId, appId, contextId, true,
  ).catch(((err) => {
    logger.error(`could not fetch inventory ${err}`);
    next(err);
  }));
  const item = inventory.find((i) => i.assetid === assetId);
  if (item === undefined) {
    res.status(400).json({ detail: 'this item does not exists in your inventory' });
  }

  const user = await User.findOne({ steamId: req.user.steamId });
  let sellOrder = new SellOrderModel({
    seller: user,
    price,
    appId: item.appid,
    contextId: item.contextid,
    assetId: item.assetid,
  });

  sendDepositTrade(req.user.steamId, item.assetid, async (err, success, offerId: string) => {
    if (err) {
      logger.error(`sendDepositTradeError : ${err}`);
      res.status(503);
    }
    sellOrder.tradeOffer = await TradeOffer.create({
      offerId,
      user,
    });
    await sellOrder.save();
    sellOrder = await sellOrder.populate('tradeOffer').execPopulate();
    res.json({ sellOrder, success });
  });
});
export = router;
