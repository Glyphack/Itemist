/* eslint-disable @typescript-eslint/no-unsafe-call */
import HttpException from '../common/exceptions/http';
import logger from '../common/logger/winston';
import { basicLimiter } from '../common/middlewares/ratelimit';
import corsOptions from '../config/cors';
import { initSentry } from '../config/sentry';
import { initPassport } from '../config/steam';
import { setupViewEngine } from '../config/view';
import { i18n } from '../config/i18n';
import * as Sentry from '@sentry/node';
import bodyParser from 'body-parser';
import cors from 'cors';
import express, { NextFunction, Request, Response, Router } from 'express';
import createError from 'http-errors';
import morgan from 'morgan';
import path from 'path';

class Server {
  app = express();

  /*
  lazy initialization needed to be able to avoid top level await in 
  main file.
  */
  setup(routes: Router, i18nProvider: i18n.I18n): void {
    initPassport(this.app);
    initSentry(this.app);
    setupViewEngine(this.app);
    this.app.use(cors(corsOptions));
    this.app.set('trust proxy', 1);
    this.app.use(morgan('combined'));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(express.static(path.join(__dirname, '/../public')));
    this.app.use(basicLimiter);
    this.app.use(i18nProvider.init);
    this.app.use(routes);
    this.setupErrorHandlers(this.app);
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

      res.status(err.status || 500).send({
        type: err.type || 'Unknown',
        title: err.title,
        detail: err.detail,
      });
    });
  }
}

export { Server };
