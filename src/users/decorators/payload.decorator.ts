import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { RequestPayload, User } from '../entities/user.entity';

export const Payload = createParamDecorator(
  (
    key: keyof RequestPayload,
    context: ExecutionContext,
  ): RequestPayload | RequestPayload[keyof RequestPayload] => {
    const request: Request = context.switchToHttp().getRequest();
    const payload: RequestPayload = request.payload;

    if (payload && key) {
      return payload[key];
    }

    return payload;
  },
);
