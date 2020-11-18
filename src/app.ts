import logger from './logger/winston';
import routesV1 from './api/routes';
import HttpException from './exceptions/http';
import createError from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';

const Sentry = require('@sentry/node');
require('./bot/bot');
require('./orders/orders.queue');
require('./orders/orders.worker');

const app = express();

Sentry.init({ dsn: process.env.SENTRY_DSN });

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => logger.info('Connected to MongoDB 🔥'))
  .catch((e) => {
    throw new Error(`Could not connect to database${e}`);
  });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

require('./config/steam')(app);

const swaggerDocument = YAML.load('./docs/OpenAPI/itemist.yaml');

app.use(cors());
app.use(Sentry.Handlers.requestHandler());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(morgan('combined'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/v1', routesV1);

app.use(Sentry.Handlers.errorHandler());

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

export = app;
