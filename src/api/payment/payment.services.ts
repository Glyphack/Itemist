import zarinpal from '../../utils/zarinpal';

/**
 * PaymentRequest [module]
 * @return {String} URL [Payement Authority]
 */
async function startPayment(amount: number): Promise<{url?: string, authority?: string}> {
  const response = await zarinpal.PaymentRequest({
    Amount: amount, // In Tomans
    CallbackURL: 'http://localhost:4000/v1/payment/verify',
    Description: 'A Payment from Node.JS',
    Email: 'shayegan@yahoo.com',
    Mobile: '09214723668',
  });
  if (response.status === 100) {
    return { url: response.url, authority: response.authority };
  }
  return {};
}

export = { startPayment };
