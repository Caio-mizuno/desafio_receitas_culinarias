import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateUserDto } from '../src/modules/users/dtos/create-user';
import {
  CreateRecipeDto,
  UpdateRecipeDto,
} from '../src/modules/recipes/dto/recipe.dto';

describe('Recipes (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let recipeId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const uniqueId = Date.now();
    const mockUser: CreateUserDto = {
      nome: `Rec User ${uniqueId}`,
      login: `recuser${uniqueId}`,
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
    const token = body.response?.access_token ?? body.access_token;
    accessToken = token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/recipes (POST) - Create Recipe', async () => {
    const dto: CreateRecipeDto = {
      nome: 'Bolo',
      modoPreparo: 'Misturar e assar',
      ingredientes: 'Farinha, ovos, açúcar',
      tempoPreparoMinutos: 30,
      porcoes: 4,
    };

    const res = await request(app.getHttpServer())
      .post('/recipes')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(dto)
      .expect(201);

    expect(res.body.status).toBe(true);
    expect(res.body.response).toHaveProperty('id');
    recipeId = res.body.response.id;
  });

  it('/recipes (GET) - List Recipes (public, paginated)', async () => {
    const res = await request(app.getHttpServer())
      .get('/recipes?page=1&limit=12')
      .expect(200);
    expect(Array.isArray(res.body.response)).toBe(true);
    expect(res.body.page).toBe(1);
    expect(res.body.finalPage).toBeGreaterThanOrEqual(1);
  });

  it('/recipes/my (GET) - List My Recipes (auth)', async () => {
    const res = await request(app.getHttpServer())
      .get('/recipes/my?page=1&limit=12')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
    expect(Array.isArray(res.body.response)).toBe(true);
    expect(res.body.page).toBe(1);
  });

  it('/recipes/:id (GET) - Get Recipe (public)', async () => {
    const res = await request(app.getHttpServer())
      .get(`/recipes/${recipeId}`)
      .expect(200);
    expect(res.body.status).toBe(true);
    expect(res.body.response.id).toBe(recipeId);
  });

  it('/recipes/:id (PUT) - Update Recipe (auth, owner)', async () => {
    const dto: UpdateRecipeDto = { nome: 'Bolo de Chocolate' };
    const res = await request(app.getHttpServer())
      .put(`/recipes/${recipeId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(dto)
      .expect(200);
    expect(res.body.status).toBe(true);
    expect(res.body.response.nome).toBe('Bolo de Chocolate');
  });

  it('/recipes/:id (DELETE) - Delete Recipe (auth, owner)', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/recipes/${recipeId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
    expect(res.body.status).toBe(true);
    expect(res.body.response).toBeNull();
  });
});
