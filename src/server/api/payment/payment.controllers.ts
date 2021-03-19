import zarinpal from './zarinpal';
import TransactionModel from './payment.model';
import { ITransaction } from './payment.model';
import logger from '../../../common/logger/winston';
import CartModel from '../cart/cart.model';
import { OrdersQueue } from '../../../queues/orders/orders.queue';
import { SendProductJob, TradeOfferItemInfo } from '../../../queues/orders/types';
import { IProduct } from '../products/product.model';
import SellOrderModel from '../sell/sellOrder.model';
import UserModel from '../profile/profile.model';
import { AuthenticatedRequest } from '../../../types/request';
import { Response } from 'express';
import { nanoid } from 'nanoid';

interface VerifyPaymentRequest {
  query: { Authority: string; Status: string };
}

export async function verifyPayment(req: VerifyPaymentRequest, res: Response): Promise<void> {
  const transaction = await TransactionModel.findOne({ authority: req.query.Authority })
    .populate({
      path: 'user',
      model: 'User',
      select: 'tradeUrl _id',
    })
    .exec();
  const transactionStatus = req.query.Status;
  if (transactionStatus === 'OK') {
    try {
      const response = await zarinpal.PaymentVerification({
        Amount: transaction.amount,
        Authority: req.query.Authority,
      });
      let status: string;
      if (response.status === 101 || response.status === 100) {
        status = 'successful';
        await markSellOrdersAsSold(transaction.products);
        await transferMoneyToSellersWallets(transaction.products);
        sendProducts(transaction.products, transaction.user.tradeUrl);
      } else {
        logger.error(`transaction failed response: ${JSON.stringify(response)}`);
        status = 'failed';
      }
      void failTransaction(transaction, response.RefID.toString());
      res.redirect(
        301,
        `${process.env.FRONTEND_PAYMENT_CALLBACK}/${status}?orderId=${transaction.orderId}`,
      );
    } catch (err) {
      if (err instanceof Error)
        logger.error(`error in payment verification ${err.name} ${err.message} ${err.stack}`);
      res.redirect(
        301,
        `${process.env.FRONTEND_PAYMENT_CALLBACK}/failed?orderId=${transaction.orderId}`,
      );
    }
  } else {
    logger.error(
      `transaction because status is not ok Status: ${transactionStatus} , orderId: ${transaction.orderId}`,
    );
    void failTransaction(transaction);
    res.redirect(
      301,
      `${process.env.FRONTEND_PAYMENT_CALLBACK}/failed?orderId=${transaction.orderId}`,
    );
  }
}

async function failTransaction(transaction: ITransaction, refID?: string) {
  if (!!refID) transaction.refId = refID;
  transaction.status = 'failed';
  await transaction.save();
  await CartModel.updateOne({ user: transaction.user }, { $set: { products: [] } }).exec();
}

export async function transactionHistory(req: AuthenticatedRequest, res: Response): Promise<void> {
  const user = await UserModel.findOne({ steamId: req.user.steamId });
  res.json(await TransactionModel.find({ user }));
}

function sendProducts(products: IProduct[], userTradeUrl: string): void {
  const itemsToDeliverNow: TradeOfferItemInfo[] = [];
  products.forEach((product: IProduct) => {
    const now = new Date().getTime();
    const diff: number = product.becomeTradable.getTime() - now;
    if (diff > 0) {
      const delayedJob: SendProductJob = {
        tradeUrl: userTradeUrl,
        items: [
          {
            assetId: product.steamItem.assetId,
            contextId: product.steamItem.contextId,
            appId: product.steamItem.appId,
          },
        ],
      };
      void OrdersQueue.queue.add(nanoid(10), delayedJob, { delay: diff });
    } else {
      itemsToDeliverNow.push({
        assetId: product.steamItem.assetId,
        contextId: product.steamItem.contextId,
        appId: product.steamItem.appId,
      });
    }
    if (itemsToDeliverNow.length != 0) {
      const jobToRunNow: SendProductJob = {
        tradeUrl: userTradeUrl,
        items: itemsToDeliverNow,
      };
      void OrdersQueue.queue.add(nanoid(10), jobToRunNow);
    }
  });
}

async function markSellOrdersAsSold(products: IProduct[]): Promise<void> {
  await Promise.all(
    products.map((product: IProduct) => {
      try {
        void SellOrderModel.updateOne({ _id: product.sellOrder }, { state: 'sold' }).exec();
      } catch (err) {
        if (err instanceof Error)
          logger.error('error setting sell order status', { error: JSON.stringify(err) });
      }
    }),
  );
}

async function transferMoneyToSellersWallets(products: IProduct[]): Promise<void> {
  await Promise.all(
    products.map(async (product: IProduct) => {
      try {
        const amount: number = product.price * 0.95;
        await UserModel.updateOne({ _id: product.seller }, { $inc: { balance: amount } }).exec();
      } catch (err) {
        if (err instanceof Error)
          logger.error('error transfering money to user product', { error: JSON.stringify(err) });
      }
    }),
  );
}
