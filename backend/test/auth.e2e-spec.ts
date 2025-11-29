import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateUserDto } from '../src/modules/users/dtos/create-user';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let createdUser: CreateUserDto;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/login (POST) - Success', async () => {
    // 1. Create a user first
    const uniqueId = Date.now();
    createdUser = {
      nome: `Test User ${uniqueId}`,
      login: `testuser${uniqueId}`,
      senha: 'password123',
    };

    await request(app.getHttpServer())
      .post('/users')
      .send(createdUser)
      .expect(201);

    // 2. Login with the created user
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        login: createdUser.login,
        senha: createdUser.senha,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe(true);
        expect(res.body.response).toHaveProperty('access_token');
      });
  });

  it('/auth/login (POST) - Unauthorized', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        login: createdUser.login,
        senha: 'wrongpassword',
      })
      .expect(401);
  });
});
