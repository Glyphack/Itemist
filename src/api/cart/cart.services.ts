import Product from '../../models/product.model';
import User from '../../models/user.model';
import Cart from '../../models/cart.model';

async function getOrCreateCart(steamId) {
  const user = await User.findOne({ steamId });
  const cart = await Cart.findOne({ user }).populate({
    path: 'products',
    model: 'Product',
    select: 'name iconUrl price',
  }).exec();
  if (cart) {
    return cart;
  }
  return Cart.create({ user });
}

async function addProductToCart(cartId, productId) {
  const product = await Product.findById(productId);
  await Cart.updateOne(
    { _id: cartId },
    { $push: { products: [product] } },
  ).exec();
}

async function removeProductFromCart(cartId, productId) {
  await Cart.updateOne(
    { _id: cartId },
    { $pull: { products: productId } },
  ).exec();
}

async function emptyCartProducts(cartId) {
  await Cart.updateOne({ _id: cartId }, { $set: { products: [] } }).exec();
}

export {
  getOrCreateCart, addProductToCart, removeProductFromCart, emptyCartProducts,
};
