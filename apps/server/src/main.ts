/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { LogLevel, Logger } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { AllExceptionsFilter } from './exception/all-exceptions.filter';

async function bootstrap() {
  const logLevel: LogLevel[] = process.env.LOGGER_LEVEL
    ? (process.env.LOGGER_LEVEL.split(',') as LogLevel[])
    : ['log', 'error', 'warn', 'debug', 'verbose'];

  const app = await NestFactory.create(AppModule, {
    logger: logLevel,
  });

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  const globalPrefix = 'api';
  app.enableCors();
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
