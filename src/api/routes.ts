import express from 'express';

import jwtMiddleWare from '../middlewares/auth';
import authRoutes from './auth/auth.routes';
import profileRoutes from './profile/profile.routes';
import sellOrdersRoutes from './sell/sell.routes';
// import productRoutes from './products/products';
// import paymentRoutes from './payment/payment.routes';
// import cartRoutes from './cart/cart.routes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/profile', jwtMiddleWare, profileRoutes);
router.use('/sell', jwtMiddleWare, sellOrdersRoutes);
// router.use('/products', productRoutes);
// router.use('/cart', cartRoutes);
// router.use('/payment', paymentRoutes);

export = router;
