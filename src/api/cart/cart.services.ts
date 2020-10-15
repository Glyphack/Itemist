import Product from '../../models/product.model';
import Cart, { ICart } from '../../models/cart.model';
import UserModel from '../../models/user.model';

async function getOrCreateCart(steamId: string): Promise<ICart> {
  const cart = await Cart.findOne({ 'user.steamId': steamId })
    .populate({
      path: 'products',
      model: 'Product',
      select: 'name iconUrl price -seller',
    })
    .exec();
  if (cart) {
    return cart;
  }
  const user = new UserModel({ steamId: steamId });
  return await Cart.create({ user });
}

async function addProductToCart(cartId: string, productId: string): Promise<void> {
  const product = await Product.findById(productId);
  const cart = await Cart.findById(cartId);
  cart.products.push(product);
  await cart.save();
}

async function removeProductFromCart(cartId: string, productId: string): Promise<void> {
  await Cart.updateOne({ _id: cartId }, { $pull: { products: productId } }).exec();
}

async function emptyCartProducts(cartId: string): Promise<void> {
  await Cart.updateOne({ _id: cartId }, { $set: { products: [] } }).exec();
}

export { getOrCreateCart, addProductToCart, removeProductFromCart, emptyCartProducts };
