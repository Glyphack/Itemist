import { AuthenticatedRequest } from '../../../types/request';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import express from 'express';

const router = express.Router();

router.get('/steam', passport.authenticate('steam', { session: false }));

router.get(
  '/steam/return',
  passport.authenticate('steam', { session: false }),
  (req: AuthenticatedRequest, res) => {
    const token = jwt.sign(
      {
        steamId: req.user.steamId,
      },
      process.env.SECRET_KEY,
      { expiresIn: '5d' },
    );
    res.render('authenticated', {
      jwtToken: token,
      clientUrl: process.env.FRONTEND_URL,
      redirectPath: '/profile', // path to redirect user to after login
    });
  },
);

export = router;
