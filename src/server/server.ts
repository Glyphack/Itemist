/* eslint-disable @typescript-eslint/no-unsafe-call */
import { initPassport } from '../config/steam';
import { initSentry } from '../config/sentry';
import HttpException from '../common/exceptions/http';
import logger from '../common/logger/winston';
import { NextFunction, Router, Request, Response } from 'express';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import * as csrf from 'csurf';
import createError from 'http-errors';
import * as Sentry from '@sentry/node';
import path from 'path';

class Server {
  app = express();

  /*
  lazy initialization needed to be able to avoid top level await in 
  main file.
  */
  setup(routes: Router): void {
    initPassport(this.app);
    initSentry(this.app);
    this.app.use(cors());
    this.app.use(morgan('combined'));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(cookieParser());
    this.app.use(express.static(path.join(__dirname, '/../public')));
    this.app.use(csrf({ cookie: true }));
    this.app.use(routes);
  }

  setupErrorHandlers(app: express.Express): void {
    app.use(Sentry.Handlers.errorHandler() as express.ErrorRequestHandler);
    // catch 404 and forward to error handler
    app.use((req, res, next) => {
      next(createError(404));
    });

    // error handler
    // eslint-disable-next-line no-unused-vars
    app.use((err: HttpException, req: Request, res: Response, next: NextFunction) => {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      logger.error(
        `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`,
      );

      // render the error page
      res.status(err.status || 500);
      res.send('error');
    });
  }
}

export { Server };
