import Product from '../../models/product.model';
import User from '../../models/user.model';
import Cart from '../../models/cart.model';

async function getOrCreateCart(steamId: string): Promise<void> {
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
  return await Cart.create({ 'user.steamId': steamId });
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
