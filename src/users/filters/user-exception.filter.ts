import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { ConfigService } from '../../config';
import { Request } from 'express';

@Catch()
export class UserExceptionFilter<T> implements ExceptionFilter {
  private logger = new Logger('User exceptions logger');

  constructor(private config: ConfigService) {}

  catch(exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request: Request = ctx.getRequest();
    const response = ctx.getResponse();

    const status = exception.status || 500;
    const userId = request?.payload?.user.id;

    const data = {
      statusCode: status,
      userId,
      path: request.url,
      errorsStack: this.config.DEBUG ? exception.stack : null,
      errorsMessage: this.config.DEBUG ? exception.message : null,
    };

    this.logger.error(data);

    response.status(status).json(data);
  }
}
