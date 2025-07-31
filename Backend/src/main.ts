import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable logger only in development
  if (process.env.NODE_ENV === 'development') {
    Logger.log('Logger enabled in development mode');
  } else {
    // Disable logger in production
    Logger.overrideLogger(false); // Disable logger in production
  }
  // Enable Cors
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: false,
  });
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
