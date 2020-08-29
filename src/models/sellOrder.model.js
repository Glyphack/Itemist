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
});

sellOrderSchema.index({ seller: 1, assetId: 1 }, { unique: true });

module.exports = mongoose.model('SellOrder', sellOrderSchema);
