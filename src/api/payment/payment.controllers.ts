import zarinpal from './zarinpal';
import logger from '../../logger/winston';
import TransactionModel from '../../models/transaction.model';
import CartModel from '../../models/cart.model';
import ordersQueue from '../../orders/orders.queue';
import { SendProductJob, TradeOfferItemInfo } from '../../orders/schema';
import { IProduct } from '../../models/product.model';
import { Response } from 'express';
import { nanoid } from 'nanoid';

interface VerifyPaymentRequest {
  query: { Authority: string; Status: string };
}

export default async function verifyPayment(
  req: VerifyPaymentRequest,
  res: Response,
): Promise<void> {
  const transaction = await TransactionModel.findOne({ authority: req.query.Authority })
    .populate({
      path: 'products',
      model: 'Product',
      select: 'steamItem.assetId steamItem.contextId steamItem.appId becomeTradable',
    })
    .populate({
      path: 'user',
      model: 'User',
      select: 'tradeUrl',
    })
    .exec();
  const transactionStatus = req.query.Status;
  try {
    const response = await zarinpal.PaymentVerification({
      Amount: transaction.amount,
      Authority: req.query.Authority,
    });
    let status: string;
    if (response.status === 101 || response.status === 100) {
      status = 'successful';
      sendProducts(transaction.products, transaction.user.tradeUrl);
    } else {
      status = 'failed';
    }
    transaction.refId = response.RefID.toString();
    transaction.status = status;
    await transaction.save();
    await CartModel.updateOne({ user: transaction.user }, { $set: { products: [] } }).exec();
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
      void ordersQueue.add(nanoid(10), delayedJob, { delay: diff });
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
      void ordersQueue.add(nanoid(10), jobToRunNow);
    }
  });
}
