const express = require('express');

const cartRouter = express.Router();

/**
 * initialize cart or get last cart
 */
cartRouter.get('/');

/**
 * add items to cart
 */
cartRouter.post('/');

/**
 * delete product from cart
 */
cartRouter.delete('/:cartId/:productId');

/**
 * empty cart
 */
cartRouter.delete('/:cartId/empty');

module.exports = {cartRoutes: cartRouter};
