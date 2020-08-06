const mongoose = require('mongoose');
const createProductFromSellOrder = require('../api/products/products.services');

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
  tradeStatus: {
    type: String,
    enum: ['Not sent', 'Pending', 'Succesful', 'Failed'],
    default: 'Not sent',
  },
});

sellOrderSchema.post('save', async (doc) => {
  if (doc.tradeStatus === 'Succesful') {
    createProductFromSellOrder(doc);
  }
});

module.exports = mongoose.model('sellEntry', sellOrderSchema);
