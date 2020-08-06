const mongoose = require('mongoose');
const { walletSchema } = require('./wallet');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  steamId: {
    type: String,
  },
  avatar: {
    type: String,
  },
  profileUrl: {
    type: String,
  },
  tradeUrl: {
    type: String,
  },
  wallet: walletSchema,
});

module.exports = mongoose.model('user', userSchema);
