import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { RecipesRepository } from './recipes.repository';
import { Recipe } from '../entities/recipe.entity';

describe('RecipesRepository', () => {
  let repository: RecipesRepository;
  let typeOrmRepository: Repository<Recipe>;

  const mockQueryBuilder: any = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
    getManyAndCount: jest.fn(),
    getRawOne: jest.fn(),
  };

  const mockTypeOrmRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    count: jest.fn(),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipesRepository,
        {
          provide: getRepositoryToken(Recipe),
          useValue: mockTypeOrmRepository,
        },
      ],
    }).compile();

    repository = module.get<RecipesRepository>(RecipesRepository);
    typeOrmRepository = module.get<Repository<Recipe>>(
      getRepositoryToken(Recipe),
    );
    jest.clearAllMocks();
  });

  it('deve ser definido', () => {
    expect(repository).toBeDefined();
  });

  describe('createEntity', () => {
    it('deve criar uma entidade Recipe', () => {
      const dto = { nome: 'Bolo', descricao: 'Delicioso' };
      const recipe = { id: 1, ...dto } as any;

      mockTypeOrmRepository.create.mockReturnValue(recipe);

      const result = repository.createEntity(dto);

      expect(result).toEqual(recipe);
      expect(mockTypeOrmRepository.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('save', () => {
    it('deve salvar uma receita', async () => {
      const recipe = { id: 1, nome: 'Bolo' } as any;

      mockTypeOrmRepository.save.mockResolvedValue(recipe);

      const result = await repository.save(recipe);

      expect(result).toEqual(recipe);
      expect(mockTypeOrmRepository.save).toHaveBeenCalledWith(recipe);
    });
  });

  describe('findAll', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockQueryBuilder.leftJoinAndSelect.mockReturnThis();
      mockQueryBuilder.orderBy.mockReturnThis();
      mockQueryBuilder.andWhere.mockReturnThis();
      mockQueryBuilder.take.mockReturnThis();
    });

    it('deve retornar todas as receitas sem filtros', async () => {
      const recipes = [{ id: 1, nome: 'Bolo' }] as Recipe[];
      mockQueryBuilder.getMany.mockResolvedValue(recipes);

      const result = await repository.findAll();

      expect(result).toEqual(recipes);
      expect(mockTypeOrmRepository.createQueryBuilder).toHaveBeenCalledWith(
        'recipe',
      );
    });

    it('deve filtrar por categoriaId', async () => {
      const recipes = [{ id: 1, nome: 'Bolo', categoriaId: 2 }] as Recipe[];
      mockQueryBuilder.getMany.mockResolvedValue(recipes);

      await repository.findAll({ categoriaId: 2 });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'recipe.categoriaId = :categoriaId',
        { categoriaId: 2 },
      );
    });

    it('deve filtrar por nome', async () => {
      const recipes = [{ id: 1, nome: 'Bolo' }] as Recipe[];
      mockQueryBuilder.getMany.mockResolvedValue(recipes);

      await repository.findAll({ nome: 'Bolo' });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'recipe.nome LIKE :nome',
        { nome: '%Bolo%' },
      );
    });

    it('deve filtrar por usuarioId', async () => {
      const recipes = [{ id: 1, nome: 'Bolo', usuarioId: 5 }] as Recipe[];
      mockQueryBuilder.getMany.mockResolvedValue(recipes);

      await repository.findAll({ usuarioId: 5 });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'recipe.usuarioId = :usuarioId',
        { usuarioId: 5 },
      );
    });

    it('deve aplicar limit quando fornecido', async () => {
      const recipes = [{ id: 1 }] as Recipe[];
      mockQueryBuilder.getMany.mockResolvedValue(recipes);

      await repository.findAll({ limit: 10 });

      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
    });
  });

  describe('findAllWithPagination', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockQueryBuilder.leftJoinAndSelect.mockReturnThis();
      mockQueryBuilder.orderBy.mockReturnThis();
      mockQueryBuilder.andWhere.mockReturnThis();
      mockQueryBuilder.skip.mockReturnThis();
      mockQueryBuilder.take.mockReturnThis();
    });

    it('deve retornar receitas paginadas com valores padrão', async () => {
      const recipes = [{ id: 1 }] as Recipe[];
      mockQueryBuilder.getManyAndCount.mockResolvedValue([recipes, 1]);

      const result = await repository.findAllWithPagination();

      expect(result).toEqual({ items: recipes, total: 1 });
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(12);
    });

    it('deve aplicar paginação customizada', async () => {
      const recipes = [{ id: 1 }] as Recipe[];
      mockQueryBuilder.getManyAndCount.mockResolvedValue([recipes, 25]);

      const result = await repository.findAllWithPagination({
        page: 2,
        limit: 10,
      });

      expect(result).toEqual({ items: recipes, total: 25 });
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(10);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
    });

    it('deve filtrar por nome e categoriaId com paginação', async () => {
      const recipes = [{ id: 1 }] as Recipe[];
      mockQueryBuilder.getManyAndCount.mockResolvedValue([recipes, 5]);

      await repository.findAllWithPagination({
        nome: 'Pizza',
        categoriaId: 3,
        page: 1,
        limit: 5,
      });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'recipe.categoriaId = :categoriaId',
        { categoriaId: 3 },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'recipe.nome LIKE :nome',
        { nome: '%Pizza%' },
      );
    });
  });

  describe('findById', () => {
    it('deve retornar receita por id com relações', async () => {
      const recipe = { id: 1, nome: 'Bolo' } as any;
      mockTypeOrmRepository.findOne.mockResolvedValue(recipe);

      const result = await repository.findById(1);

      expect(result).toEqual(recipe);
      expect(mockTypeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['categoria', 'usuario'],
      });
    });

    it('deve retornar null quando receita não existir', async () => {
      mockTypeOrmRepository.findOne.mockResolvedValue(null);

      const result = await repository.findById(999);

      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('deve remover uma receita', async () => {
      const recipe = { id: 1, nome: 'Bolo' } as any;
      mockTypeOrmRepository.remove.mockResolvedValue(recipe);

      const result = await repository.remove(recipe);

      expect(result).toEqual(recipe);
      expect(mockTypeOrmRepository.remove).toHaveBeenCalledWith(recipe);
    });
  });

  describe('countByUser', () => {
    it('deve retornar contagem de receitas do usuário', async () => {
      mockTypeOrmRepository.count.mockResolvedValue(5);

      const result = await repository.countByUser(1);

      expect(result).toBe(5);
      expect(mockTypeOrmRepository.count).toHaveBeenCalledWith({
        where: { usuarioId: 1 },
      });
    });

    it('deve retornar 0 quando usuário não tem receitas', async () => {
      mockTypeOrmRepository.count.mockResolvedValue(0);

      const result = await repository.countByUser(999);

      expect(result).toBe(0);
    });
  });

  describe('countDistinctCategoriesByUser', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      mockQueryBuilder.select.mockReturnThis();
      mockQueryBuilder.where.mockReturnThis();
      mockQueryBuilder.andWhere.mockReturnThis();
    });

    it('deve retornar contagem de categorias distintas do usuário', async () => {
      mockQueryBuilder.getRawOne.mockResolvedValue({ count: '3' });

      const result = await repository.countDistinctCategoriesByUser(1);

      expect(result).toBe(3);
      expect(mockQueryBuilder.select).toHaveBeenCalledWith(
        'COUNT(DISTINCT recipe.categoriaId)',
        'count',
      );
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'recipe.usuarioId = :userId',
        { userId: 1 },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'recipe.categoriaId IS NOT NULL',
      );
    });

    it('deve retornar 0 quando usuário não tem categorias', async () => {
      mockQueryBuilder.getRawOne.mockResolvedValue({ count: '0' });

      const result = await repository.countDistinctCategoriesByUser(999);

      expect(result).toBe(0);
    });

    it('deve retornar 0 quando query retorna null', async () => {
      mockQueryBuilder.getRawOne.mockResolvedValue(null);

      const result = await repository.countDistinctCategoriesByUser(999);

      expect(result).toBe(0);
    });
  });
});
