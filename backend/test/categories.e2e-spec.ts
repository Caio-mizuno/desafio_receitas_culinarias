import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateUserDto } from '../src/modules/users/dtos/create-user';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from '../src/modules/categories/dto/category.dto';

describe('Categories (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let categoryId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const uniqueId = Date.now();
    const mockUser: CreateUserDto = {
      nome: `Cat User ${uniqueId}`,
      login: `catuser${uniqueId}`,
      senha: 'password123',
    };

    await request(app.getHttpServer())
      .post('/users')
      .send(mockUser)
      .expect(201);

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ login: mockUser.login, senha: mockUser.senha })
      .expect(200);

    const body = loginRes.body as any;
    const token = body.response?.access_token ?? body.access_token; // compatibilidade
    accessToken = token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/categories (POST) - Create Category', async () => {
    const dto: CreateCategoryDto = { nome: 'Doces' };
    const res = await request(app.getHttpServer())
      .post('/categories')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(dto)
      .expect(201);

    expect(res.body.status).toBe(true);
    expect(res.body.response).toHaveProperty('id');
    expect(res.body.response.nome).toBe('Doces');
    categoryId = res.body.response.id;
  });

  it('/categories (GET) - List Categories (public)', async () => {
    const res = await request(app.getHttpServer())
      .get('/categories')
      .expect(200);
    expect(res.body.status).toBe(true);
    expect(Array.isArray(res.body.response)).toBe(true);
    expect(
      res.body.response.find((c: any) => c.id === categoryId),
    ).toBeTruthy();
  });

  it('/categories/:id (GET) - Get Category (public)', async () => {
    const res = await request(app.getHttpServer())
      .get(`/categories/${categoryId}`)
      .expect(200);
    expect(res.body.status).toBe(true);
    expect(res.body.response.id).toBe(categoryId);
  });

  it('/categories/:id (PUT) - Update Category', async () => {
    const dto: UpdateCategoryDto = { nome: 'Salgados' };
    const res = await request(app.getHttpServer())
      .put(`/categories/${categoryId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(dto)
      .expect(200);
    expect(res.body.status).toBe(true);
    expect(res.body.response.nome).toBe('Salgados');
  });

  it('/categories/:id (DELETE) - Delete Category', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/categories/${categoryId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
    expect(res.body.status).toBe(true);
    expect(res.body.response).toBeNull();
  });
});
