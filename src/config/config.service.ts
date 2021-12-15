import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { mkdir, stat } from 'fs/promises';
import { resolve } from 'path';

export const joinUrl = (...paths) => paths.join('/');

@Injectable()
export class ConfigService implements OnModuleInit, OnModuleDestroy {
  readonly DEBUG = process.env.DEBUG;
  readonly PORT = process.env.PORT;
  readonly DOMAIN = process.env.DOMAIN;
  readonly STORAGE_DIR = resolve(process.env.STORAGE_DIR);
  readonly JWT_SECRET = process.env.JWT_SECRET;

  readonly STORAGE_TMP = resolve(this.STORAGE_DIR, 'tmp');
  readonly STORAGE_PHOTOS = resolve(this.STORAGE_DIR, 'photos');
  readonly STORAGE_ASSETS = resolve(this.STORAGE_DIR, 'assets');
  readonly STORAGE_THUMBS = resolve(this.STORAGE_ASSETS, 'thumbs');

  readonly PHOTOS_DOMAIN = 'http://localhost:3000';
  readonly PHOTOS_BASE_PATH = joinUrl(this.PHOTOS_DOMAIN, 'thumbs');
  readonly PHOTOS_DOWNLOAD_PATH = joinUrl(
    this.PHOTOS_DOMAIN,
    'photos/download',
  );

  async onModuleInit() {
    //TODO validate config values

    const storageRoot = await stat(this.STORAGE_DIR).catch((e) => null);

    if (!storageRoot) {
      throw new Error('Please configure env variable STORAGE_DIR');
    }
    //create storage schema
    await mkdir(this.STORAGE_TMP, { recursive: true });
    await mkdir(this.STORAGE_PHOTOS, { recursive: true });
    await mkdir(this.STORAGE_ASSETS, { recursive: true });
    await mkdir(this.STORAGE_THUMBS, { recursive: true });
  }

  async onModuleDestroy() {
    console.log('Destroy module config');
  }
}
