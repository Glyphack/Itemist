const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  steamId: {
    type: String,
  },
  name: {
    type: String,
  },
  avatar: {
    type: String,
  },
  profile_url: {
    type: String,
  },
  steam_id: {
    type: String,
  },
});

module.exports = mongoose.model("user", userSchema);
