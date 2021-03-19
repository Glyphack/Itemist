import authRoutes from './auth/auth.routes';
import profileRoutes from './profile/profile.routes';
import sellOrdersRoutes from './sell/sell.routes';
import productRoutes from './products/products.routes';
import paymentRoutes from './payment/payment.routes';
import cartRoutes from './cart/cart.routes';
import jwtMiddleWare from '../../common/middlewares/auth';
import express from 'express';

const apiRouter = express.Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/profile', jwtMiddleWare, profileRoutes);
apiRouter.use('/sell', jwtMiddleWare, sellOrdersRoutes);
apiRouter.use('/products', productRoutes);
apiRouter.use('/cart', jwtMiddleWare, cartRoutes);
apiRouter.use('/payment', paymentRoutes);

export = apiRouter;
