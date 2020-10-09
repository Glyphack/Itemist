/* eslint-disable no-underscore-dangle */
import Transaction from '../../models/transaction.model';
import User from '../../models/user.model';
import startPayment from '../payment/payment.services';
import { AuthenticatedRequest } from '../../types/request';
import {
  emptyCartProducts, removeProductFromCart, addProductToCart, getOrCreateCart,
} from './cart.services';
import transactionModel from '../../models/transaction.model';

async function getCart(req: AuthenticatedRequest, res) {
  res.json(await getOrCreateCart(req.user.steamId));
}

/**
 * @param {string} req.body.productId
 */
async function addToCart(req: AuthenticatedRequest, res) {
  const cart = await getOrCreateCart(req.user.steamId);
  await addProductToCart(cart._id, req.body.productId);
  res.json(await getOrCreateCart(req.user.steamId));
}

/**
 * @param {string} req.body.productId
 * @param {Object} req.user
 */
async function removeFromCart(req: AuthenticatedRequest, res) {
  const cart = await getOrCreateCart(req.user.steamId);
  await removeProductFromCart(cart._id, req.body.productId);
  res.json(await getOrCreateCart(req.user.steamId));
}

async function emptyCart(req: AuthenticatedRequest, res) {
  const cart = await getOrCreateCart(req.user.steamId);
  await emptyCartProducts(cart._id);
  res.json(await getOrCreateCart(req.user.steamId));
}

async function checkOut(req: AuthenticatedRequest, res) {
  const user = await User.findOne({ steamId: req.user.steamId });
  const cart = await getOrCreateCart(req.user.steamId);
  const { url, authority } = await startPayment(1000);
  const transaction = new Transaction({
    user, authority, status: 'pending', products: cart.products, amount: 1000,
  });
  await transaction.save();
  res.json({ paymentUrl: url });
}

export {
  getCart, addToCart, removeFromCart, emptyCart, checkOut,
};
