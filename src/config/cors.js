export default {
  origin: function (origin, callback) {
    whitelist = process.env.CORS_WHITELIST;
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
};
