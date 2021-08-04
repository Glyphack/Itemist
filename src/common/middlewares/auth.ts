/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import HttpException from '../exceptions/http';
import jwt from 'express-jwt';
import { NextFunction, Request } from 'express';
import Response from 'express';

const jwtMiddleWare = [
  jwt({
    secret: process.env.SECRET_KEY,
    algorithms: ['HS256'],
  }),
  function (err: Error, req: Request, res: Response, next: NextFunction): void {
    throw new HttpException(
      401,
      'UnAuthenticated',
      err.message,
      'Login Required',
      'Login to continue',
    );
  },
];

export = jwtMiddleWare;
