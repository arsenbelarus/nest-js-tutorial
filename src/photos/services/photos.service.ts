import { Injectable } from '@nestjs/common';
import { extname, join } from 'path';
import { ConfigService, joinUrl } from '../../config';
import { readdir, rename } from 'fs/promises';
import { createHash } from 'crypto';
import * as sharp from 'sharp';

@Injectable()
export class PhotosService {
  constructor(private config: ConfigService) {}

  async create(file: Express.Multer.File) {
    const ext = extname(file.originalname).toLowerCase();
    const filename = createHash('md5').update(file.path).digest('hex') + ext;
    const destFile = join(this.config.STORAGE_PHOTOS, filename);

    await rename(file.path, destFile);

    const photo = {
      filename,
    };

    return photo;
  }

  async createThumb(fileName: string) {
    const srcFile = join(this.config.STORAGE_PHOTOS, fileName);
    const destFile = join(this.config.STORAGE_THUMBS, fileName);

    await sharp(srcFile)
      .rotate()
      .resize(200, 200)
      .jpeg({ quality: 100 })
      .toFile(destFile);

    return { small: destFile };
  }

  async getUserPhotos() {
    const files: string[] = await readdir(this.config.STORAGE_PHOTOS);

    return files.map((file) => ({
      thumbUrl: joinUrl(this.config.PHOTOS_BASE_PATH, file),
      downloadUrl: joinUrl(this.config.PHOTOS_DOWNLOAD_PATH, file),
    }));
  }
}
