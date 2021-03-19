/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import jwt from 'express-jwt';

const jwtMiddleWare = jwt({
  secret: process.env.SECRET_KEY,
  algorithms: ['HS256'],
});

export = jwtMiddleWare;
