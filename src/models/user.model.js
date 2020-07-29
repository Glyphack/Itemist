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
  },
});

module.exports = mongoose.model('user', userSchema);
