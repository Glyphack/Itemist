import winston from 'winston';
import Sentry from 'winston-sentry-log';

const sentryOptions = {
  config: {
    dsn: process.env.SENTRY_DSN,
  },
  level: 'warn',
};

const options: winston.LoggerOptions = {
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
    }),
    new Sentry(sentryOptions),
  ],
};

const logger = winston.createLogger(options);

if (process.env.NODE_ENV !== 'production') {
  logger.debug('Logging initialized at debug level');
}

export default logger;
