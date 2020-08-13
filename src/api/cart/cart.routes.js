const express = require('express');
const jwtMiddleWare = require("../../middlewares/auth");
const {checkOut} = require("./cart.controllers");
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
cartRouter.post('/', addToCart);

/**
 * delete product from cart
 */
cartRouter.delete('/', removeFromCart);

/**
 * empty cart
 */
cartRouter.delete('/empty', emptyCart);

/**
 * checkout
 */
cartRouter.get('/checkout', checkOut);

module.exports = {cartRoutes: cartRouter};
