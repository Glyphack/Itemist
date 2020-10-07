const passport = require('passport');
const { Strategy } = require('passport-steam');
const {User} = require('../models/user.model');

const strategyOptions = {
  returnURL: `${process.env.BASE_URL}/auth/steam/return`,
  realm: `${process.env.BASE_URL}/`,
  apiKey: process.env.STEAM_API_KEY,
};

module.exports = (app) => {
  passport.use(
    new Strategy(strategyOptions, async (identifier, profile, done) => {
      let user = await User.findOne({ steamId: profile._json.steamid });
      if (user) {
        return done(null, user);
      }
      const newUser = await new User({
        name: profile._json.personaname,
        avatar: profile._json.avatar,
        profileUrl: profile._json.profileurl,
        steamId: profile._json.steamid,
      }).save();
      return done(null, newUser);
    }),
  );

  app.use(passport.initialize());
};
