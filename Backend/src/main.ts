import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
