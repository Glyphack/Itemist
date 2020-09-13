const mongoose = require('mongoose');
const {createProductFromSellOrder} = require("../api/products/products.services");

const sellOrderSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  price: {
    type: Number,
  },
  appId: {
    type: String,
  },
  contextId: {
    type: String,
  },
  assetId: {
    type: String,
  },
  tradeOffer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TradeOffer',
  },
  success: {
    type: Boolean,
    default: false,
  }
});

sellOrderSchema.index({ appId:1, contextId: 1, assetId: 1 }, { unique: true });

module.exports = {SellOrder: mongoose.model('SellOrder', sellOrderSchema)};
