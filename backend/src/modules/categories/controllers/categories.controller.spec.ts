import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from '../services/categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';
import { Category } from '../entities/category.entity';

describe('CategoriesController', () => {
  let controller: CategoriesController;

  const mockCategoriesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a category', async () => {
      const dto: CreateCategoryDto = { nome: 'Doces' };
      const result: Category = { id: 1, nome: 'Doces', receitas: [] };
      mockCategoriesService.create.mockResolvedValue(result);

      const wrapped = await controller.create(dto);
      expect(wrapped).toEqual({
        response: result,
        message: 'Categoria criada com sucesso',
        status: true,
      });
      expect(mockCategoriesService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return categories', async () => {
      const result: Category[] = [{ id: 1, nome: 'Doces', receitas: [] }];
      mockCategoriesService.findAll.mockResolvedValue(result);

      const wrapped = await controller.findAll();
      expect(wrapped).toEqual({
        response: result,
        message: 'Categorias listadas com sucesso',
        status: true,
      });
      expect(mockCategoriesService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a category by id', async () => {
      const result: Category = { id: 1, nome: 'Doces', receitas: [] };
      mockCategoriesService.findOne.mockResolvedValue(result);

      const wrapped = await controller.findOne('1');
      expect(wrapped).toEqual({
        response: result,
        message: 'Categoria encontrada com sucesso',
        status: true,
      });
      expect(mockCategoriesService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const dto: UpdateCategoryDto = { nome: 'Salgados' };
      const result: Category = { id: 1, nome: 'Salgados', receitas: [] };
      mockCategoriesService.update.mockResolvedValue(result);

      const wrapped = await controller.update('1', dto);
      expect(wrapped).toEqual({
        response: result,
        message: 'Categoria atualizada com sucesso',
        status: true,
      });
      expect(mockCategoriesService.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should remove a category', async () => {
      mockCategoriesService.remove.mockResolvedValue(undefined);

      const wrapped = await controller.remove('1');
      expect(wrapped).toEqual({
        response: null,
        message: 'Categoria removida com sucesso',
        status: true,
      });
      expect(mockCategoriesService.remove).toHaveBeenCalledWith(1);
    });
  });
});
