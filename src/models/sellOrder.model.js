const mongoose = require('mongoose');

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
  },
  {timestamps: true}
);

module.exports = {SellOrder: mongoose.model('SellOrder', sellOrderSchema)};
