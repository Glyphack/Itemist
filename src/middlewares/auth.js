const jwt = require('express-jwt');

const jwtMiddleWare = jwt({
  secret: process.env.SECRET_KEY,
  algorithms: ['HS256'],
});

module.exports = jwtMiddleWare;
