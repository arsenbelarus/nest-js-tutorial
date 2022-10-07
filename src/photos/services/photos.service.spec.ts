import { Test, TestingModule } from '@nestjs/testing';
import { copyFile, stat, unlink } from 'fs/promises';
import { join } from 'path';
import { ConfigModule, ConfigService } from '../../config';
import { PhotosService } from './photos.service';

describe('PhotosService', () => {
  let service: PhotosService;
  let configService: ConfigService;
  let file: Express.Multer.File;
  const fixtureName = 'test.jpg';
  const fixturePath = `./test/fixtures/${fixtureName}`;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        PhotosService,
        /* {
          provide: ConfigService, 
          useValue: {
            STORAGE_TMP: './storage/tmp',
            STORAGE_PHOTOS: './storage/photos',
            STORAGE_THUMBS: './storage/assets/thumbs',
          } as ConfigService,
        } */
      ],
    }).compile();

    service = module.get<PhotosService>(PhotosService);
    configService = module.get<ConfigService>(ConfigService);

    file = {
      originalname: fixtureName,
      path: join(configService.STORAGE_TMP, fixtureName),
    } as Express.Multer.File;

    await copyFile(fixturePath, join(configService.STORAGE_TMP, fixtureName));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('PhotosService.create() should create photo', async () => {
    const photo = await service.create(file);
    const uploadedFile = join(configService.STORAGE_PHOTOS, photo.filename);
    await expect(stat(uploadedFile)).resolves.toBeDefined();
    expect(photo.filename).toContain('.jpg');

    await unlink(uploadedFile);
  });

  it('PhotosService.createThumbs() should create thumbs', async () => {
    const uploadedFile = join(configService.STORAGE_PHOTOS, fixtureName);
    await copyFile(fixturePath, uploadedFile);
    const thumbs = await service.createThumb(fixtureName);

    await expect(stat(thumbs.small)).resolves.toBeDefined();
    expect(thumbs.small).toContain('.jpg');

    await unlink(uploadedFile);
    await unlink(thumbs.small);
  });
});
