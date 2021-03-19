import {
  emptyCartProducts,
  removeProductFromCart,
  addProductToCart,
  getOrCreateCart,
} from './cart.services';
import { AddToCartRequest, RemoveFromCartRequest } from './cart.types';
import { ICart } from './cart.model';
import User from '../profile/profile.model';
import startPayment from '../payment/payment.services';
import { AuthenticatedRequest } from '../../../types/request';
import TransactionModel from '../payment/payment.model';
import { IProduct } from '../products/product.model';
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
  const user = await User.findOne({ steamId: req.user.steamId });
  const cart = await getOrCreateCart(req.user.steamId);
  if (cart.products.length == 0) {
    res.statusCode = 400;
    res.json({ detail: 'You did not select any item to buy' });
    return;
  }
  const [allProductsAvailable, unavailableProducts] = checkAllProductsAvailableToCheckout(
    cart.products,
  );
  if (!allProductsAvailable) {
    res.statusCode = 400;
    res.json({ detail: 'These products are not available:' + unavailableProducts.join() });
    return;
  }
  const totalPrice = calculateCartTotalPrice(cart);
  const { url, authority } = await startPayment(totalPrice);
  const transaction = new TransactionModel({
    user,
    authority,
    status: 'pending',
    products: cart.products,
    amount: totalPrice,
  });
  await transaction.save();
  res.json({ paymentUrl: url });
}

function calculateCartTotalPrice(cart: ICart): number {
  let totalPrice = 0;
  cart.products.forEach((product: IProduct) => {
    totalPrice += product.price;
  });
  return totalPrice;
}

function checkAllProductsAvailableToCheckout(products: IProduct[]): [boolean, string[]] {
  const unavailableItems: string[] = [];
  products.forEach((product: IProduct) => {
    if (!product.isAvailable) {
      unavailableItems.push(product.steamItem.name);
    }
  });
  if (unavailableItems.length == 0) return [true, []];
  else return [true, unavailableItems];
}

export { getCart, addToCart, removeFromCart, emptyCart, checkOut };
