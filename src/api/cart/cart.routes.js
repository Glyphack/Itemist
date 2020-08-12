const express = require('express');
const jwtMiddleWare = require("../../middlewares/auth");
const {emptyCart} = require("./cart.controllers");
const {removeFromCart} = require("./cart.controllers");
const {getCart, addToCart} = require("./cart.controllers");
const cartRouter = express.Router();

cartRouter.use(jwtMiddleWare)

/**
 * get cart
 */
cartRouter.get('/', getCart);

/**
 * add item to cart
 */
cartRouter.post('/:cartId', addToCart);

/**
 * delete product from cart
 */
cartRouter.delete('/:cartId', removeFromCart);

/**
 * empty cart
 */
cartRouter.delete('/:cartId/empty', emptyCart);

module.exports = {cartRoutes: cartRouter};
