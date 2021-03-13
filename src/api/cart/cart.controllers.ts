import {
  emptyCartProducts,
  removeProductFromCart,
  addProductToCart,
  getOrCreateCart,
} from './cart.services';
import { AddToCartRequest, RemoveFromCartRequest } from './cart.schemas';
import User from '../../models/user.model';
import startPayment from '../payment/payment.services';
import { AuthenticatedRequest } from '../../types/request';
import TransactionModel from '../../models/transaction.model';
import { Response } from 'express';

async function getCart(req: AuthenticatedRequest, res: Response): Promise<void> {
  res.json(await getOrCreateCart(req.user.steamId));
}

async function addToCart(req: AddToCartRequest, res: Response): Promise<void> {
  const cart = await getOrCreateCart(req.user.steamId);
  await addProductToCart(cart._id, req.body.productId);
  res.json(await getOrCreateCart(req.user.steamId));
}

async function removeFromCart(req: RemoveFromCartRequest, res: Response): Promise<void> {
  const cart = await getOrCreateCart(req.user.steamId);
  await removeProductFromCart(cart._id, req.body.productId);
  res.json(await getOrCreateCart(req.user.steamId));
}

async function emptyCart(req: AuthenticatedRequest, res: Response): Promise<void> {
  const cart = await getOrCreateCart(req.user.steamId);
  await emptyCartProducts(cart._id);
  res.json(await getOrCreateCart(req.user.steamId));
}

async function checkOut(req: AuthenticatedRequest, res: Response): Promise<void> {
  // TODO: check is available before checkout to prevent concurrent buys
  // TODO: check product not empty
  const user = await User.findOne({ steamId: req.user.steamId });
  const cart = await getOrCreateCart(req.user.steamId);
  const { url, authority } = await startPayment(1000);
  const transaction = new TransactionModel({
    user,
    authority,
    status: 'pending',
    products: cart.products,
    amount: 1000,
  });
  await transaction.save();
  res.json({ paymentUrl: url });
}

export { getCart, addToCart, removeFromCart, emptyCart, checkOut };
