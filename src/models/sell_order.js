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
  tradeStatus: {
    type: String,
  },
});

module.exports = mongoose.model('sellEntry', sellOrderSchema);
