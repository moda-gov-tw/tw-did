import { Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stack = (exception as any)?.stack;
    if (stack) {
      this.logger.debug(stack);
    }

    super.catch(exception, host);
  }
}
