<<<<<<< HEAD:src/config/steam.ts
/* eslint-disable no-underscore-dangle */
import passport from 'passport';
import Strategy from 'passport-steam';
import User from '../models/user.model';
=======
const passport = require('passport');
const { Strategy } = require('passport-steam');
const {User} = require('../models/user.model');
>>>>>>> 8f4c49562055863c1b278865139add1ec3502490:src/config/steam.js

const strategyOptions = {
  returnURL: `${process.env.BASE_URL}/auth/steam/return`,
  realm: `${process.env.BASE_URL}/`,
  apiKey: process.env.STEAM_API_KEY,
};

export = (app) => {
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
