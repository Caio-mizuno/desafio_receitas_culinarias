import { Test, TestingModule } from '@nestjs/testing';
import { RecipesService } from './recipes.service';
import { RecipesRepository } from '../repositories/recipes.repository';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateRecipeDto, UpdateRecipeDto } from '../dto/recipe.dto';
import { Recipe } from '../entities/recipe.entity';

describe('RecipesService', () => {
  let service: RecipesService;

  const mockRepo = {
    createEntity: jest.fn(),
    save: jest.fn(),
    findAll: jest.fn(),
    findAllWithPagination: jest.fn(),
    findById: jest.fn(),
    remove: jest.fn(),
  } as unknown as jest.Mocked<RecipesRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipesService,
        { provide: RecipesRepository, useValue: mockRepo },
      ],
    }).compile();

    service = module.get<RecipesService>(RecipesService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar receita vinculando usuarioId do usuário', async () => {
      const dto: CreateRecipeDto = {
        nome: 'Bolo',
        tempoPreparoMinutos: 30,
        porcoes: 4,
        modoPreparo: 'Misturar e assar',
        ingredientes: 'Farinha',
        categoriaId: 1,
      } as any;
      const user = { id: 10 } as any;
      const entity: Recipe = { id: 1, usuarioId: 10 } as any;
      (mockRepo.createEntity as any).mockReturnValue(entity);
      (mockRepo.save as any).mockResolvedValue(entity);

      const result = await service.create(dto, user);
      expect(result).toEqual(entity);
      expect(mockRepo.createEntity).toHaveBeenCalledWith({
        ...dto,
        usuarioId: 10,
      });
      expect(mockRepo.save).toHaveBeenCalledWith(entity);
    });
  });

  describe('findAll', () => {
    it('deve repassar query para repositório', async () => {
      const list: Recipe[] = [];
      (mockRepo.findAll as any).mockResolvedValue(list);
      const query = { categoriaId: 1, nome: 'Bolo', limit: 5, usuarioId: 10 };
      const result = await service.findAll(query);
      expect(result).toEqual(list);
      expect(mockRepo.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('findAllPaginated', () => {
    it('deve calcular finalPage e nextPage corretamente', async () => {
      (mockRepo.findAllWithPagination as any).mockResolvedValue({
        items: [{ id: 1 } as any],
        total: 25,
      });

      const result = await service.findAllPaginated({ page: 1, limit: 12 });
      expect(result.items.length).toBe(1);
      expect(result.total).toBe(25);
      expect(result.page).toBe(1);
      expect(result.finalPage).toBe(3);
      expect(result.nextPage).toBe(2);
    });

    it('deve retornar nextPage null quando pagina for a última', async () => {
      (mockRepo.findAllWithPagination as any).mockResolvedValue({
        items: [],
        total: 24,
      });
      const result = await service.findAllPaginated({ page: 2, limit: 12 });
      expect(result.finalPage).toBe(2);
      expect(result.nextPage).toBeNull();
    });
  });

  describe('findOne', () => {
    it('deve retornar receita existente', async () => {
      const entity: Recipe = { id: 1 } as any;
      (mockRepo.findById as any).mockResolvedValue(entity);
      const result = await service.findOne(1);
      expect(result).toEqual(entity);
      expect(mockRepo.findById).toHaveBeenCalledWith(1);
    });

    it('deve lançar NotFoundException quando não encontrada', async () => {
      (mockRepo.findById as any).mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('deve atualizar quando usuário é dono', async () => {
      const entity: Recipe = { id: 1, usuarioId: 10, nome: 'Bolo' } as any;
      const dto: UpdateRecipeDto = { nome: 'Bolo de Chocolate' } as any;
      const user = { id: 10 } as any;
      (mockRepo.findById as any).mockResolvedValue(entity);
      (mockRepo.save as any).mockImplementation(async (r: Recipe) => r);

      const result = await service.update(1, dto, user);
      expect(result.nome).toEqual('Bolo de Chocolate');
      expect(mockRepo.save).toHaveBeenCalled();
    });

    it('deve lançar ForbiddenException quando usuário não é dono', async () => {
      const entity: Recipe = { id: 1, usuarioId: 99, nome: 'Bolo' } as any;
      const dto: UpdateRecipeDto = { nome: 'Bolo 2' } as any;
      const user = { id: 10 } as any;
      (mockRepo.findById as any).mockResolvedValue(entity);

      await expect(service.update(1, dto, user)).rejects.toBeInstanceOf(
        ForbiddenException,
      );
    });
  });

  describe('remove', () => {
    it('deve remover quando usuário é dono', async () => {
      const entity: Recipe = { id: 1, usuarioId: 10 } as any;
      const user = { id: 10 } as any;
      (mockRepo.findById as any).mockResolvedValue(entity);
      (mockRepo.remove as any).mockResolvedValue(entity);

      await service.remove(1, user);
      expect(mockRepo.remove).toHaveBeenCalledWith(entity);
    });

    it('deve lançar ForbiddenException quando usuário não é dono', async () => {
      const entity: Recipe = { id: 1, usuarioId: 99 } as any;
      const user = { id: 10 } as any;
      (mockRepo.findById as any).mockResolvedValue(entity);

      await expect(service.remove(1, user)).rejects.toBeInstanceOf(
        ForbiddenException,
      );
    });
  });
});
