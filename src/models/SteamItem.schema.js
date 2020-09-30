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

const SteamItemSchema = new mongoose.Schema({
    productId: {
      type: String,
    },
    appId: {
      type: String,
      required: true,
    },
    classId: {
      type: String,
      required: true,
    },
    instanceId: {
      type: String,
      required: true,
    },
    assetId: {
      type: String,
      required: true,
    },
    contextId: {
      type: String,
      required: true,
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
      type: Boolean,
    },
    commodity: {
      type: Boolean,
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
  },
  {timestamps: true}
);

module.exports = {SteamItemSchema: SteamItemSchema}
