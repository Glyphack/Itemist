const express = require('express');

const jwtMiddleWare = require('../middlewares/auth.js');
const authRoutes = require('./auth/auth.routes');
const profileRoutes = require('./profile/profile.routes');
const sellOrdersRoutes = require('./sell/sell.routes');
const productRoutes = require('./products/products');
const {paymentRoutes} = require("./payment/payment.routes");
const {cartRoutes} = require("./cart/cart.routes");

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/profile', jwtMiddleWare, profileRoutes);
router.use('/sell', jwtMiddleWare, sellOrdersRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/payment', paymentRoutes);

module.exports = router;
