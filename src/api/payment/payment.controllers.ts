import zarinpal from './zarinpal';
import logger from '../../logger/winston';
import { Response } from 'express';
import TransactionModel from '../../models/transaction.model';

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
    } else {
      status = 'failed';
    }
    transaction.refId = response.RefID;
    transaction.status = status;
    await transaction.save();
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
