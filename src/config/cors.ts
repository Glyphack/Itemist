const corsOptions = {
  origin: process.env.CORS_WHITELIST,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

export default corsOptions;
