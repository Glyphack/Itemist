const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  balance: {
    type: Number,
    default: 0,
  },
});

const Wallet = mongoose.model('wallet', walletSchema);

module.exports = { Wallet, walletSchema };
