/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable no-underscore-dangle */
import User from '../server/api/profile/profile.model';
import passport from 'passport';
import Strategy from 'passport-steam';
import express from 'express';

const steamOathOptions = {
  returnURL: `${process.env.BASE_URL}/auth/steam/return`,
  realm: `${process.env.BASE_URL}/`,
  apiKey: process.env.STEAM_API_KEY,
};

function initPassport(app: express.Express): void {
  passport.use(
    new Strategy(steamOathOptions, async (identifier, profile, done) => {
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
}

export { initPassport };
