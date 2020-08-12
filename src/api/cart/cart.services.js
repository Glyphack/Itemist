const {Product} = require("../../models/product.model");
const {User} = require("../../models/user.model");
const {Cart} = require("../../models/cart.model");

async function getOrCreateCart(steamId) {
  const user = await User.findOne({steamId: steamId});
  const cart = await Cart.findOne({user: user}).populate({
    path: "products",
    model: "Product",
    select: 'name iconUrl price'
  }).exec();
  if (cart) {
    return cart;
  } else {
    return await Cart.create({user: user});
  }
}

async function addProductToCart(cartId, productId) {
  const product = await Product.findById(productId);
  await Cart.updateOne(
    {_id: cartId},
    {$push: {products: [product]}}
  ).exec();
}

async function removeProductFromCart(cartId, productId) {
  await Cart.updateOne(
    {_id: cartId},
    {$pull: {products: productId}}
  ).exec();
}

async function emptyCartProducts(cartId) {
  await Cart.updateOne({_id: cartId}, {$set: {products: []}}).exec();
}


module.exports = {getOrCreateCart, addProductToCart, removeProductFromCart, emptyCartProducts};
