const passport = require('passport');
const express = require('express');

const jwtMiddleWare = require('../middlewares/auth.js');
const authRoutes = require('../routes/auth.routes');
const userRoutes = require('../routes/users.routes');
const sellOrdersRoutes = require('../routes/sell_orders');
const productRoutes = require('../routes/products');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/user', jwtMiddleWare, userRoutes);
router.use('/sell-entries', jwtMiddleWare, sellOrdersRoutes);
router.use('/products', productRoutes);

module.exports = router;
