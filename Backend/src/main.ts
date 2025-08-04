import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import * as Sentry from '@sentry/node';
import { SentryExceptionFilter } from './sentry-exception.filter';
import { ValidationPipe } from '@nestjs/common';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new SentryExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  // Enable logger only in development
  if (process.env.NODE_ENV === 'development') {
    Logger.log('Logger enabled in development mode');
  } else {
    // Disable logger in production
    Logger.overrideLogger(false); // Disable logger in production
  }
  // Enable CookieParser
  app.use(cookieParser());
  // Enable Cors
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://notes-web-app-tan.vercel.app',
    ],
    credentials: true,
  });
  // Enable RateLimiter
  app.use(
    '/auth',
    rateLimit({
      windowMs: 60 * 1000, //
      max: 60,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
