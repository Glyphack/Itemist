const {emptyCartProducts} = require("./cart.services");
const {removeProductFromCart} = require("./cart.services");
const {addProductToCart} = require("./cart.services");
const {getOrCreateCart} = require("./cart.services");

async function getCart(req, res){
  res.json(await getOrCreateCart(req.user.steamId));
}

/**
 * @param {string}  req.params.cartId
 * @param {string} req.body.productId
 */
async function addToCart(req, res){
  await addProductToCart(req.params.cartId, req.body.productId);
  res.json(await getOrCreateCart(req.user.steamId));
}
/**
 * @param {string}  req.params.cartId
 * @param {string} req.body.productId
 */
async function removeFromCart(req, res) {
  await removeProductFromCart(req.params.cartId, req.body.productId);
  res.json(await getOrCreateCart(req.user.steamId));
}

/**
 * @param {string} req.params.cartId
 */
async function emptyCart(req, res) {
  await emptyCartProducts(req.params.cartId);
  res.json(await getOrCreateCart(req.user.steamId));
}

module.exports = {getCart, addToCart, removeFromCart, emptyCart}