import ZarinpalCheckout from 'zarinpal-checkout';

export interface IZarinpal {
  PaymentRequest: (options) => {status: number, authority: string, url: string};
  PaymentVerification: (options) => {status: number, RefID: string}
}

/**
 * Create ZarinPal
 * @param {String} `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` [Merchant ID]
 * @param {Boolean} false [toggle `Sandbox` mode]
 */
const zarinpal: IZarinpal = ZarinpalCheckout.create(process.env.ZARINPAL_MERCHANT, true);

export default zarinpal;
