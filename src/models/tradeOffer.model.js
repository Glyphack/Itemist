const mongoose = require('mongoose');

const TradeOfferSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  offerId: {
    type: String,
  },
  tradeStatus: {
    type: String,
    enum: ['Not sent', 'Pending', 'Succesful', 'Failed'],
    default: 'Not sent',
  },

});

TradeOfferSchema.index({ offerId: 1, }, { unique: true });

module.exports = {TradeOffer: mongoose.model('TradeOffer', TradeOfferSchema)};
