const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  avatar: {
    type: String,
  },
  profileUrl: {
    type: String,
  },
  steamId: {
    type: String,
  },
  tradeUrl: {
    type: String,
  },
});

module.exports = mongoose.model('user', userSchema);
