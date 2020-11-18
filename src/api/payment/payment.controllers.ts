import zarinpal from './zarinpal';
import logger from '../../logger/winston';
import TransactionModel from '../../models/transaction.model';
import CartModel from '../../models/cart.model';
import ordersQueue from '../../orders/orders.queue';
import { SendProductJob } from '../../orders/schema';
import { IProduct } from '../../models/product.model';
import { Response } from 'express';

interface VerifyPaymentRequest {
  query: { Authority: string; Status: string };
}

export default async function verifyPayment(
  req: VerifyPaymentRequest,
  res: Response,
): Promise<void> {
  const transaction = await TransactionModel.findOne({ authority: req.query.Authority });
  const transactionStatus = req.query.Status;
  try {
    const response = await zarinpal.PaymentVerification({
      Amount: transaction.amount,
      Authority: req.query.Authority,
    });
    let status: string;
    if (response.status === 101 || response.status === 100) {
      status = 'successful';
      sendProducts(transaction.products, transaction.user.steamId);
    } else {
      status = 'failed';
    }
    transaction.refId = response.RefID.toString();
    transaction.status = status;
    await transaction.save();
    await CartModel.updateOne({ user: transaction.user }, { $set: { products: [] } }).exec();
    res.redirect(
      301,
      `${process.env.FRONTEND_PAYMENT_CALLBACK}?status=${transactionStatus}?refId=${response.RefID}`,
    );
  } catch (err) {
    logger.error(err);
    transaction.status = 'Error Occurred';
    await transaction.save();
    res.redirect(301, `${process.env.FRONTEND_PAYMENT_CALLBACK}?status=Error`);
  }
}

function sendProducts(products: IProduct[], steamId: string): void {
  products.forEach((product: IProduct) => {
    const job: SendProductJob = {
      toSteamId: steamId,
      assetId: product.steamItem.assetId,
      contextId: product.steamItem.contextId,
      appId: product.steamItem.appId,
    };
    now = new Date().getTime();
    const diff = product.becomeTradable - now;
    if (diff > 0) {
      await ordersQueue.add(product._id, job, { delay: diff });
    } else {
      await ordersQueue.add(product._id, job);
    }
  });
}
