import { checkOut, emptyCart, removeFromCart, getCart, addToCart } from './cart.controllers';
import jwtMiddleWare from '../../../common/middlewares/auth';
import express from 'express';

const cartRouter = express.Router();

cartRouter.use(jwtMiddleWare);

/**
 * get cart
 */
cartRouter.get('/', getCart);

/**
 * add item to cart
 */
cartRouter.post('/add-product', addToCart);

/**
 * delete product from cart
 */
cartRouter.post('/remove-product', removeFromCart);

/**
 * empty cart
 */
cartRouter.delete('/empty', emptyCart);

/**
 * checkout
 */
cartRouter.get('/checkout', checkOut);

export default cartRouter;
