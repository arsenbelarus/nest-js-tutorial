import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import {
  AuthLoginDto,
  AuthLoginResponse,
  AuthRegisterDto,
  AuthRegisterResponse,
} from '../src/users/dto/auth.dto';
import { UsersErrorResponse } from '../src/users/dto/user.dto';
import { User } from '../src/users/entities/user.entity';
import { AuthService } from '../src/users/services/auth.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    authService = app.get(AuthService)
  });

  it('/auth/register (POST) should throw validation error 400', () => {
    return request(app.getHttpServer()).post('/auth/register').expect(400);
  });

  it('/auth/register (POST) should register new user', () => {
    const reqBody: AuthRegisterDto = {
      name: 'Arsen',
      email: 'arsen@gmail.com',
      password: '123456',
    };
    const resBody: AuthRegisterResponse = {
      user: {
        name: 'Arsen',
        email: 'arsen@gmail.com',
        id: expect.any(Number),
      },
    };
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(reqBody)
      .expect(201)
      .then((res) => {
        expect(res.body).toMatchObject(resBody);
      });
  });

  it('/auth/login (POST) should log user in', () => {
    const reqBody: AuthLoginDto = {
      email: 'dawid@myflow.pl',
      password: '123',
    };
    const resBody: AuthLoginResponse = {
      user: {
        name: 'Dawid',
        email: 'dawid@myflow.pl',
        id: expect.any(Number),
      },
      token: expect.any(String),
    };
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(reqBody)
      .expect(201)
      .then((res) => {
        expect(res.body).toMatchObject(resBody);
      });
  });

  it('/users-admin/me (GET) should throw 403', () => {
    const resBody: UsersErrorResponse = {
        error: 'Forbidden',
        message: 'Forbidden resource',
        statusCode: 403,
    };
    return request(app.getHttpServer())
      .get('/users-admin/me')
      .expect(403)
      .then((res) => {
        expect(res.body).toMatchObject(resBody);
      });
  });

  it('/users-admin/me (GET) should return User', async () => {
    const resBody: User = {
        name: 'Dawid',
        email: 'dawid@myflow.pl',
        id: 2,
    };
    const token = await authService.encodeUserToken(resBody);
    return request(app.getHttpServer())
      .get('/users-admin/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((res) => {
        expect(res.body).toMatchObject(resBody);
      });
  });
});
