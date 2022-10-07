import { Injectable } from '@nestjs/common';
import { extname, join } from 'path';
import { ConfigService, joinUrl } from '../../config';
import { readdir, rename } from 'fs/promises';
import { createHash } from 'crypto';
import * as sharp from 'sharp';
import { PhotoEntity } from '../entities/photo.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class PhotosService {
  constructor(
    private config: ConfigService,

    @InjectRepository(PhotoEntity)
    private photoRepo: Repository<PhotoEntity>,
  ) {}

  async create(file: Express.Multer.File, user: User) {
    const ext = extname(file.originalname).toLowerCase();
    const filename = createHash('md5').update(file.path).digest('hex') + ext;
    const destFile = join(this.config.STORAGE_PHOTOS, filename);

    await rename(file.path, destFile);

    const photo = new PhotoEntity();
    photo.filename = filename;
    photo.description = file.originalname;
    photo.user = user;

    await this.photoRepo.save(photo);

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
    const files: string[] = await this.photoRepo
      .find()
      .then((res) => res.map((photo) => photo.filename));

    return files.map((file) => ({
      thumbUrl: joinUrl(this.config.PHOTOS_BASE_PATH, file),
      downloadUrl: joinUrl(this.config.PHOTOS_DOWNLOAD_PATH, file),
    }));
  }
}
