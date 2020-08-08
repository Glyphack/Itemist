require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const winston = require('./config/winston');
const routesV1 = require('./api/routes');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => winston.info('Connected to MongoDB 🔥'))
  .catch(() => {
    throw new Error('Could not connect to database');
  });

const app = express();

app.use(morgan('combined', { stream: winston.stream }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

require('./config/steam')(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/v1', routesV1);

// catch 404 a)nd forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  winston.error(
    `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`,
  );

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

module.exports = app;
