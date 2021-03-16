import express from 'express';
import jwtMiddleWare from '../../common/middlewares/auth';
import { checkOut, emptyCart, removeFromCart, getCart, addToCart } from './cart.controllers';

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
