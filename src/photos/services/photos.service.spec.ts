import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '../../config';
import { PhotosService } from './photos.service';

describe('PhotosService', () => {
  let service: PhotosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PhotosService,
        {
          provide: ConfigService, 
          useValue: {
            
          } as ConfigService,
        }
      ],
    }).compile();

    service = module.get<PhotosService>(PhotosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
