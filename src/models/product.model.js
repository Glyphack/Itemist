const mongoose = require('mongoose');
const {SteamItemSchema} = require("./SteamItem.schema");

const productSchema = new mongoose.Schema({
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    becomeTradable: {
      type: Date,
      required: true,
    },
    steamItem: SteamItemSchema,
  },
  {timestamps: true}
);

module.exports = {Product: mongoose.model('Product', productSchema)}
