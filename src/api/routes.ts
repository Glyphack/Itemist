import authRoutes from './auth/auth.routes';
import profileRoutes from './profile/profile.routes';
import sellOrdersRoutes from './sell/sell.routes';
import productRoutes from './products/products.routes';
import paymentRoutes from './payment/payment.routes';
import cartRoutes from './cart/cart.routes';
import jwtMiddleWare from '../common/middlewares/auth';
import express from 'express';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/profile', jwtMiddleWare, profileRoutes);
router.use('/sell', jwtMiddleWare, sellOrdersRoutes);
router.use('/products', productRoutes);
router.use('/cart', jwtMiddleWare, cartRoutes);
router.use('/payment', paymentRoutes);

export = router;
