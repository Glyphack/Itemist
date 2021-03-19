import winston from 'winston';
import Sentry from 'winston-sentry-log';

const sentryOptions = {
  config: {
    dsn: process.env.SENTRY_DSN,
  },
  level: 'warn',
};

let options: winston.LoggerOptions;
if (process.env.NODE_ENV === 'production')
  options = {
    transports: [
      new winston.transports.Console({
        level: 'error',
      }),
      new Sentry(sentryOptions),
    ],
  };
else {
  options = {
    transports: [
      new winston.transports.Console({
        level: 'debug',
      }),
    ],
  };
}

const logger = winston.createLogger(options);

if (process.env.NODE_ENV !== 'production') {
  logger.debug('Logging initialized at debug level');
}

export default logger;
