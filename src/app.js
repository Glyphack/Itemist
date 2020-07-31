require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const winston = require('./config/winston');
const jwtMiddleWare = require('./middlewares/auth.js');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/users.routes');
const sellOrdersRoutes = require('./routes/sell_orders');

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => winston.info('Connected to MongoDB 🔥'));

const app = express();

app.use(morgan('combined', { stream: winston.stream }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

require('./config/steam')(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use(jwtMiddleWare);

app.use('/auth', authRoutes);
app.use('/user', jwtMiddleWare, userRoutes);
app.use('/sell-entries', jwtMiddleWare, sellOrdersRoutes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  winston.error(
    `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
    req.method
    } - ${req.ip}`,
  );

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

module.exports = app;
