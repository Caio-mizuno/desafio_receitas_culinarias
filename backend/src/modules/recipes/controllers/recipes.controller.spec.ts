import { Test, TestingModule } from '@nestjs/testing';
import { RecipesController } from './recipes.controller';
import { RecipesService } from '../services/recipes.service';
import { CreateRecipeDto, UpdateRecipeDto } from '../dto/recipe.dto';
import { Recipe } from '../entities/recipe.entity';

describe('RecipesController', () => {
  let controller: RecipesController;

  const mockRecipesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findAllPaginated: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipesController],
      providers: [
        {
          provide: RecipesService,
          useValue: mockRecipesService,
        },
      ],
    }).compile();

    controller = module.get<RecipesController>(RecipesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a recipe using request user', async () => {
      const dto: CreateRecipeDto = {
        nome: 'Bolo',
        tempoPreparoMinutos: 30,
        porcoes: 4,
        modoPreparo: 'Misturar e assar',
        ingredientes: 'Farinha, ovos, açúcar',
        categoriaId: 1,
      };
      const req = { user: { id: 10 } } as any;
      const result: Recipe = {
        id: 1,
        usuarioId: 10,
        categoriaId: 1,
        nome: 'Bolo',
        tempoPreparoMinutos: 30,
        porcoes: 4,
        modoPreparo: 'Misturar e assar',
        ingredientes: 'Farinha, ovos, açúcar',
        criadoEm: new Date(),
        alteradoEm: new Date(),
        usuario: undefined,
        categoria: undefined,
      } as any;
      mockRecipesService.create.mockResolvedValue(result);

      const wrapped = await controller.create(dto, req);
      expect(wrapped).toEqual({
        response: result,
        message: 'Receita criada com sucesso',
        status: true,
      });
      expect(mockRecipesService.create).toHaveBeenCalledWith(dto, req.user);
    });
  });

  describe('findAll (paginated)', () => {
    it('should return paginated recipes with finalPage and nextPage', async () => {
      const items: Recipe[] = [
        {
          id: 1,
          usuarioId: 10,
          categoriaId: 1,
          nome: 'Bolo',
          tempoPreparoMinutos: 30,
          porcoes: 4,
          modoPreparo: 'Misturar e assar',
          ingredientes: 'Farinha, ovos, açúcar',
          criadoEm: new Date(),
          alteradoEm: new Date(),
          usuario: undefined,
          categoria: undefined,
        } as any,
      ];
      mockRecipesService.findAllPaginated.mockResolvedValue({
        items,
        total: 25,
        page: 1,
        finalPage: 3,
        nextPage: 2,
      });

      const wrappedList = await controller.findAll(1 as any, 'Bolo', 1 as any, 12 as any);
      expect(wrappedList).toEqual({
        response: items,
        page: 1,
        total: 25,
        status: true,
        finalPage: 3,
        nextPage: 2,
      });
      expect(mockRecipesService.findAllPaginated).toHaveBeenCalledWith({
        categoriaId: 1,
        nome: 'Bolo',
        page: 1,
        limit: 12,
      });
    });

    it('should return nextPage null when on last page', async () => {
      const items: Recipe[] = [];
      mockRecipesService.findAllPaginated.mockResolvedValue({
        items,
        total: 24,
        page: 2,
        finalPage: 2,
        nextPage: null,
      });

      const wrappedList = await controller.findAll(undefined, undefined, 2 as any, 12 as any);
      expect(wrappedList).toEqual({
        response: items,
        page: 2,
        total: 24,
        status: false,
        finalPage: 2,
        nextPage: null,
      });
    });
  });

  describe('findOne', () => {
    it('should return a recipe by id', async () => {
      const result: Recipe = {
        id: 1,
        usuarioId: 10,
        categoriaId: 1,
        nome: 'Bolo',
        tempoPreparoMinutos: 30,
        porcoes: 4,
        modoPreparo: 'Misturar e assar',
        ingredientes: 'Farinha, ovos, açúcar',
        criadoEm: new Date(),
        alteradoEm: new Date(),
        usuario: undefined,
        categoria: undefined,
      } as any;

      mockRecipesService.findOne.mockResolvedValue(result);

      const wrappedOne = await controller.findOne('1');
      expect(wrappedOne).toEqual({
        response: result,
        message: 'Receita encontrada com sucesso',
        status: true,
      });
      expect(mockRecipesService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a recipe using request user', async () => {
      const dto: UpdateRecipeDto = { nome: 'Bolo de Chocolate' };
      const req = { user: { id: 10 } } as any;
      const result: Recipe = {
        id: 1,
        usuarioId: 10,
        categoriaId: 1,
        nome: 'Bolo de Chocolate',
        tempoPreparoMinutos: 30,
        porcoes: 4,
        modoPreparo: 'Misturar e assar',
        ingredientes: 'Farinha, ovos, açúcar, chocolate',
        criadoEm: new Date(),
        alteradoEm: new Date(),
        usuario: undefined,
        categoria: undefined,
      } as any;
      mockRecipesService.update.mockResolvedValue(result);

      const wrappedUpdate = await controller.update('1', dto, req);
      expect(wrappedUpdate).toEqual({
        response: result,
        message: 'Receita atualizada com sucesso',
        status: true,
      });
      expect(mockRecipesService.update).toHaveBeenCalledWith(1, dto, req.user);
    });
  });

  describe('remove', () => {
    it('should remove a recipe using request user', async () => {
      const req = { user: { id: 10 } } as any;
      mockRecipesService.remove.mockResolvedValue(undefined);

      const wrappedRemove = await controller.remove('1', req);
      expect(wrappedRemove).toEqual({
        response: null,
        message: 'Receita removida com sucesso',
        status: true,
      });
      expect(mockRecipesService.remove).toHaveBeenCalledWith(1, req.user);
    });
  });
});
