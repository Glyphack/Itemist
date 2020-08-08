const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  category: {
    type: String,
  },
  color: {
    type: String,
  },
  categoryName: {
    type: String,
  },
});

const productSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  price: {
    type: Number,
  },
  productId: {
    type: String,
  },
  appId: {
    type: String,
  },
  classId: {
    type: String,
  },
  instanceId: {
    type: String,
  },
  assetId: {
    type: String,
  },
  contextId: {
    type: String,
  },
  pos: {
    type: String,
  },
  iconUrl: {
    type: String,
  },
  iconUrlLarge: {
    type: String,
  },
  name: {
    type: String,
  },
  marketHashName: {
    type: String,
  },
  marketName: {
    type: String,
  },
  nameColor: {
    type: String,
  },
  backgroundColor: {
    type: String,
  },
  type: {
    type: String,
  },
  marketable: {
    type: String,
  },
  commodity: {
    type: String,
  },
  marketTradableRestriction: {
    type: String,
  },
  marketMarketableRestriction: {
    type: String,
  },
  descriptions: {
    type: [String],
  },
  tags: {
    type: [tagSchema],
  },
});

module.exports = mongoose.model('Product', productSchema);
