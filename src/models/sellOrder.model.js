const mongoose = require('mongoose');
const createProductFromSellOrder = require('../api/products/products.services');

const sellOrderSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
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
  tradeStatus: {
    type: String,
    enum: ['Not sent', 'Pending', 'Succesful', 'Failed'],
    default: 'Not sent',
  },
});

sellOrderSchema.index({ seller: 1, assetId: 1 }, { unique: true });

module.exports = mongoose.model('sellOrder', sellOrderSchema);
