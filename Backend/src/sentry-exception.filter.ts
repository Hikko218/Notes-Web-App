// sentry-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import * as Sentry from '@sentry/node';

@Catch()
export class SentryExceptionFilter implements ExceptionFilter {
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  catch(exception: any, host: ArgumentsHost) {
    Sentry.captureException(exception);
  }
}
