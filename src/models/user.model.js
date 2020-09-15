const mongoose = require('mongoose');

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
      default: '',
    },
    wallet: {
      balance: {
        type: Number,
        default: 0,
      },
    },
  },
  {timestamps: true}
);

module.exports = {User: mongoose.model('User', userSchema)};
