import Transaction from '../../models/transaction.model';
import zarinpal from './zarinpal';
import logger from '../../logger/winston';

interface VerifyPaymentRequest {
  query: { Authority: string, Status: string }
}

export default async function verifyPayment(req: VerifyPaymentRequest, res) {
  const transaction = await Transaction.findOne({ authority: req.query.Authority });
  const transactionStatus = req.query.Status;
  try {
    const response = await zarinpal.PaymentVerification({
      Amount: transaction.amount,
      Authority: req.query.Authority,
    });
    let status;
    if (response.status === 101 || response.status === 100) {
      status = 'successful';
    } else {
      status = 'failed';
    }
    transaction.refId = response.RefID;
    transaction.status = status;
    transaction.save();
    res.redirect(
      301,
      `${process.env.FRONTEND_PAYMENT_CALLBACK}?status=${transactionStatus}?refId=${response.RefID}`,
    );
  } catch (err) {
    logger.error(err);
    transaction.status = 'Error Occured';
    transaction.save();
    res.redirect(301, `${process.env.FRONTEND_PAYMENT_CALLBACK}?status=Error`);
  }
}
