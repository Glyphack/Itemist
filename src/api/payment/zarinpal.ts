import ZarinPal = require('zarinpal-checkout');

const zarinpal = ZarinPal.create(process.env.ZARINPAL_MERCHANT, true);

export default zarinpal;
