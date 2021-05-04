import editSellOrderPrice from './sell.services';
import SellOrderModel from './sellOrder.model';
import { CreateSellOrderRequest } from './sell.schemas';
import { AuthenticatedRequest } from '../../../types/request';
import UserModel from '../profile/profile.model';
import HttpException from '../../../common/exceptions/http';
import logger from '../../../common/logger/winston';
import { getUserInventory, sendDepositTrade } from '../../../bot/bot';
import RawItem from '../../../types/steamItem';
import TradeOfferModel from '../../../models/tradeOffer.model';
import { Response } from 'express';
import * as Sentry from '@sentry/node';

async function editSellOrder(req: AuthenticatedRequest, res: Response): Promise<void> {
  const result = await editSellOrderPrice(req.body.id, req.body.price);
  if (result.n !== 1) {
    res.statusCode = 400;
    res.json({ detail: 'cannot find sell order with that id' });
    return;
  }
  const editedSellOrder = await SellOrderModel.findById(req.body.id)
    .populate('seller', 'name')
    .exec();
  res.json(editedSellOrder);
}

async function getSellOrders(req: AuthenticatedRequest, res: Response): Promise<void> {
  const user = await UserModel.findOne({ steamId: req.user.steamId });
  const sellOrders = await SellOrderModel.find({ seller: user })
    .populate({
      path: 'tradeOffer',
      model: 'TradeOffer',
      select: 'offerId tradeStatus',
    })
    .exec();
  res.send(sellOrders);
}

async function createSellOrder(req: CreateSellOrderRequest, res: Response): Promise<void> {
  const price = req.body.price;
  const appId = req.body.appId;
  const contextId = req.body.contextId;
  const assetId = req.body.assetId;

  let inventory: RawItem[];
  try {
    inventory = await getUserInventory(req.user.steamId, appId, contextId, true);
  } catch (err) {
    logger.error(`could not fetch inventory ${err}`);
    throw new HttpException(
      500,
      'InternalServerError',
      err,
      'Something went wrong',
      'Try again later',
    );
  }
  const item = inventory.find((i) => i.assetid === assetId);
  if (item === undefined) {
    res.status(400).json({ detail: 'this item does not exists in your inventory' });
  }

  const user = await UserModel.findOne({ steamId: req.user.steamId });
  let sellOrder = new SellOrderModel({
    seller: user,
    price: price,
    appId: item.appid,
    contextId: item.contextid,
    assetId: item.assetid,
  });

  void sendDepositTrade(
    user.steamId,
    user.tradeUrl,
    item.assetid,
    async (err, success: boolean, offerId: string) => {
      if (err) {
        logger.error(`sendDepositTradeError : ${err}`);
        Sentry.captureException(err);
        res.status(503).send({
          type: 'SendTradeError',
          title: 'Could not send Trade offer',
          detail: 'Try again later',
        });
      }
      sellOrder.tradeOffer = await TradeOfferModel.create({
        offerId,
        user,
      });
      await sellOrder.save();
      sellOrder = await sellOrder.populate('tradeOffer').execPopulate();
      res.json({ sellOrder, success });
    },
  );
}

export { editSellOrder, getSellOrders, createSellOrder };
