import { Injectable } from '@nestjs/common';
import { resolve } from 'path';

@Injectable()
export class ConfigService {
  readonly DEBUG = process.env.DEBUG;
  readonly PORT = process.env.PORT;
  readonly DOMAIN = process.env.DOMAIN;
  readonly STORAGE_DIR = resolve(process.env.STORAGE_DIR);
  readonly JWT_SECRET = process.env.JWT_SECRET;
}
