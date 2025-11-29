import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateUserDto } from '../src/modules/users/dtos/create-user';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let userId: number;
  const uniqueId = Date.now();
  const mockUser: CreateUserDto = {
    nome: `CRUD User ${uniqueId}`,
    login: `cruduser${uniqueId}`,
    senha: 'password123',
  };

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

  it('/users (POST) - Create User', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send(mockUser)
      .expect(201);

    expect(response.body.status).toBe(true);
    expect(response.body.response).toHaveProperty('id');
    expect(response.body.response.login).toEqual(mockUser.login);
    userId = response.body.response.id;
  });

  it('/auth/login (POST) - Login to get Token', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        login: mockUser.login,
        senha: mockUser.senha,
      })
      .expect(200);

    expect(response.body.status).toBe(true);
    expect(response.body.response).toHaveProperty('access_token');
    accessToken = response.body.response.access_token;
  });

  it('/users/:id (GET) - Get User', async () => {
    const response = await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.status).toBe(true);
    expect(response.body.response.id).toEqual(userId);
    expect(response.body.response.login).toEqual(mockUser.login);
  });

  it('/users/:id (PATCH) - Update User', async () => {
    const newName = 'Updated Name';
    const response = await request(app.getHttpServer())
      .patch(`/users/${userId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ nome: newName })
      .expect(200);

    expect(response.body.status).toBe(true);
    expect(response.body.response.nome).toEqual(newName);
  });

  it('/users/:id (DELETE) - Delete User', async () => {
    await request(app.getHttpServer())
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    // Verify deletion - Should return 401 because the user no longer exists to validate the token
    await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(401);
  });
});
