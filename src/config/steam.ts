/* eslint-disable no-underscore-dangle */
import passport from 'passport';
import Strategy from 'passport-steam';
import User from '../models/user.model';

const strategyOptions = {
  returnURL: `${process.env.BASE_URL}/auth/steam/return`,
  realm: `${process.env.BASE_URL}/`,
  apiKey: process.env.STEAM_API_KEY,
};

export = (app) => {
  passport.use(
    new Strategy(strategyOptions, async (identifier, profile, done) => {
      const user = await User.findOne({ steamId: profile._json.steamid });
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
