const passport = require("passport");
const { Strategy } = require("passport-steam");
const User = require("../models/user.model");

const strategyOptions = {
  returnURL: `${process.env.BASE_URL}/auth/steam/return`,
  realm: `${process.env.BASE_URL}/`,
  apiKey: process.env.STEAM_API_KEY,
};

module.exports = app => {
  passport.use(
    new Strategy(strategyOptions, async (identifier, profile, done) => {
      profile.identifier = identifier;

      let user = await User.findOne({ steam_id: profile._json.steamid });
      if (!user) {
        user = await new User({
          id: profile._json.steamid,
          name: profile._json.personaname,
          avatar: profile._json.avatar,
          profile_url: profile._json.profileurl,
          steam_id: profile._json.steamid
        }).save();
      }

      return done(null, user);
    }),
  );

  app.use(passport.initialize());
};
