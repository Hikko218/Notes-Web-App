import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: 'https://5d4a2b3bcaaf5c45abaa4ef4755a98df@o4509718141992960.ingest.de.sentry.io/4509787234173008',
  tracesSampleRate: 1.0,
});

console.log('Sentry initialized');
