import Product from '../../models/product.model';
import Cart, { ICart } from '../../models/cart.model';
import UserModel from '../../models/user.model';

async function getOrCreateCart(steamId: string): Promise<ICart> {
  const user = await UserModel.findOne({ steamId });
  const cart = await Cart.findOne({ user })
    .populate({
      path: 'products',
      model: 'Product',
    })
    .exec();
  if (cart) {
    return cart;
  }
  return Cart.create({ user: user });
}

async function addProductToCart(cartId: string, productId: string): Promise<void> {
  const product = await Product.findById(productId);
  await Cart.update({ _id: cartId }, { $addToSet: { products: product } });
}

async function removeProductFromCart(cartId: string, productId: string): Promise<void> {
  await Cart.updateOne({ _id: cartId }, { $pull: { products: productId } }).exec();
}

async function emptyCartProducts(cartId: string): Promise<void> {
  await Cart.updateOne({ _id: cartId }, { $set: { products: [] } }).exec();
}

export { getOrCreateCart, addProductToCart, removeProductFromCart, emptyCartProducts };
