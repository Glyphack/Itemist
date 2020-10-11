import Product from '../../models/product.model';
import User from '../../models/user.model';
import Cart from '../../models/cart.model';

async function getOrCreateCart(steamId) {
  const user = await User.findOne({ steamId });
  const cart = await Cart.findOne({ user })
    .populate({
      path: 'products',
      model: 'Product',
      select: 'name iconUrl price',
    })
    .exec();
  if (cart) {
    return cart;
  }
  return await Cart.create({ user });
}

async function addProductToCart(cartId, productId) {
  const product = await Product.findById(productId);
  const cart = await Cart.findById(cartId);
  cart.products.push(product);
  cart.save();
}

async function removeProductFromCart(cartId, productId) {
  await Cart.updateOne({ _id: cartId }, { $pull: { products: productId } }).exec();
}

async function emptyCartProducts(cartId) {
  await Cart.updateOne({ _id: cartId }, { $set: { products: [] } }).exec();
}

export { getOrCreateCart, addProductToCart, removeProductFromCart, emptyCartProducts };
