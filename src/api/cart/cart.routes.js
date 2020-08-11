const express = require('express');

const router = express.Router();

/**
 * initialize cart or get last cart
 */
router.get('/');

/**
 * add items to cart
 */
router.post('/');

/**
 * delete product from cart
 */
router.delete('/:cartId/:productId');

/**
 * empty cart
 */
router.delete('/:cartId/empty');
