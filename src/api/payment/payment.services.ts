import logger from '../../logger/winston';
import zarinpal from './zarinpal';

/**
 * PaymentRequest [module]
 * @return {String} URL [Payement Authority]
 */
export default async function startPayment(
  amount: number,
): Promise<{ url?: string; authority?: string }> {
  const response = await zarinpal.PaymentRequest({
    Amount: amount, // In Tomans
    CallbackURL: `${process.env.VERIFY_PAYMENT_CALLBACK_URL}/v1/payment/verify`,
    Description: 'A Payment from Node.JS',
    Email: 'shayegan@yahoo.com',
    Mobile: '00000000',
  });
  if (response.status === 100) {
    return { url: response.url, authority: response.authority };
  }
  return {};
}
