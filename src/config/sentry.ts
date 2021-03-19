import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import express from 'express';

export function initSentry(app: express.Express): void {
  if (process.env.NODE_ENV != 'production') return;
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      new Tracing.Integrations.Express({
        // to trace all requests to the default router
        app,
        // alternatively, you can specify the routes you want to trace:
        // router: someRouter,
      }),
    ],

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
  });

  app.use(Sentry.Handlers.requestHandler() as express.RequestHandler);
  app.use(Sentry.Handlers.tracingHandler());
}
