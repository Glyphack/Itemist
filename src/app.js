require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Sentry = require('@sentry/node');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const bodyParser = require('body-parser');
const cors = require('cors')

const {logger} = require('./logger/winston');
const routesV1 = require('./api/routes');
const corsOptions = require('./config/cors');
require('./bot/bot');



const app = express();

Sentry.init({ dsn: process.env.SENTRY_DSN });

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})
  .then(() => logger.info('Connected to MongoDB 🔥'))
  .catch((e) => {
    throw new Error('Could not connect to database' + e);
  });


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

require('./config/steam')(app);
const swaggerDocument = YAML.load('./docs/OpenAPI/itemist.yaml');

app.use(cors(corsOptions));
app.use(Sentry.Handlers.requestHandler());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(morgan('combined', { stream: logger.stream }));

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
app.use((err, req, res) => {
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

module.exports = app;
