const ZarinpalCheckout = require('zarinpal-checkout');

/**
 * Create ZarinPal
 * @param {String} `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` [Merchant ID]
 * @param {Boolean} false [toggle `Sandbox` mode]
 */
const zarinpal = ZarinpalCheckout.create(process.env.ZARINPAL_MERCHANT, true);
  
module.exports = {zarinpal};
