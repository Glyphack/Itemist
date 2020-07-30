const passport = require('passport');
const jwt = require('jsonwebtoken');
const express = require('express');

const router = express.Router();

router.get('/steam', passport.authenticate('steam', { session: false }));

router.get(
  '/steam/return',
  passport.authenticate('steam', { session: false }),
  (req, res) => {
    const token = jwt.sign(
      {
        userName: req.user.name,
      },
      process.env.SECRET_KEY,
      { expiresIn: '5d' },
    );
    res.render('authenticated', {
      jwtToken: token,
      clientUrl: process.env.FRONTEND_URL,
    });
  },
);

module.exports = router;
