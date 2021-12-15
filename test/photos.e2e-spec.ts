import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { readFileSync } from 'fs';

describe('PhotosController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/photos/uploads (POST)', async () => {

    const fixtureName = 'test.jpg';
    const fixturePath = `./test/fixtures/${fixtureName}`;

    const reqBody = {
        description: 'Hello'
    }

    const resBody = {
        photo: expect.any(Object),
        body: reqBody,
    }

    return request(app.getHttpServer())
      .post('/photos/uploads')
      .field('description', reqBody.description)
      .attach('file', readFileSync(fixturePath), fixtureName)
      .then(res => {
          expect(res.body).toMatchObject(resBody)
      })
  });
});
