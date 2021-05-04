import ratelimit from 'express-rate-limit';

const basicLimiter = ratelimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 50,
});

export { basicLimiter };
