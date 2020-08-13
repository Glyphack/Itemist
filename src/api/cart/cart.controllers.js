const {Transaction} = require('../../models/transaction.model');
const {User} = require('../../models/user.model');
const {start_payment} = require("../payment/payment.services");
const {emptyCartProducts} = require("./cart.services");
const {removeProductFromCart} = require("./cart.services");
const {addProductToCart} = require("./cart.services");
const {getOrCreateCart} = require("./cart.services");

async function getCart(req, res) {
  res.json(await getOrCreateCart(req.user.steamId));
}

/**
 * @param {string} req.body.productId
 */
async function addToCart(req, res) {
  const cart = await getOrCreateCart(req.user.steamId);
  await addProductToCart(cart._id, req.body.productId);
  res.json(await getOrCreateCart(req.user.steamId));
}

/**
 * @param {string} req.body.productId
 * @param {Object} req.user
 */
async function removeFromCart(req, res) {
  const cart = await getOrCreateCart(req.user.steamId);
  await removeProductFromCart(cart._id, req.body.productId);
  res.json(await getOrCreateCart(req.user.steamId));
}

async function emptyCart(req, res) {
  const cart = await getOrCreateCart(req.user.steamId);
  await emptyCartProducts(cart._id);
  res.json(await getOrCreateCart(req.user.steamId));
}

async function checkOut(req, res) {
  const user = await User.findOne({steamId: req.user.steamId});
  const cart = await getOrCreateCart(req.user.steamId);
  const {url, authority} = await start_payment(1000);
  Transaction.create({user: user, authority: authority, status: 'pending', products: cart.products, amount: 1000});
  res.json({paymentUrl: url});
}

module.exports = {getCart, addToCart, removeFromCart, emptyCart, checkOut}
