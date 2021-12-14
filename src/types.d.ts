import 'express';
import { RequestPayload } from './users/entities/user.entity';

declare module 'express' {
  export interface Request {
    userName: string;
    payload: RequestPayload | undefined;
  }
}
