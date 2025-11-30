import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { CategoriesRepository } from '../repositories/categories.repository';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';
import { Category } from '../entities/category.entity';

describe('CategoriesService', () => {
  let service: CategoriesService;

  const mockRepo = {
    findByName: jest.fn(),
    createEntity: jest.fn(),
    save: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    remove: jest.fn(),
  } as unknown as jest.Mocked<CategoriesRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: CategoriesRepository, useValue: mockRepo },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar categoria quando não existir por nome', async () => {
      const dto: CreateCategoryDto = { nome: 'Doces' };
      const entity: Category = { id: 1, nome: 'Doces', receitas: [] } as any;
      (mockRepo.findByName as any).mockResolvedValue(null);
      (mockRepo.createEntity as any).mockReturnValue(entity);
      (mockRepo.save as any).mockResolvedValue(entity);

      const result = await service.create(dto);
      expect(result).toEqual(entity);
      expect(mockRepo.findByName).toHaveBeenCalledWith('Doces');
      expect(mockRepo.createEntity).toHaveBeenCalledWith(dto);
      expect(mockRepo.save).toHaveBeenCalledWith(entity);
    });

    it('deve lançar ConflictException quando nome já existir', async () => {
      const dto: CreateCategoryDto = { nome: 'Doces' };
      (mockRepo.findByName as any).mockResolvedValue({ id: 2 } as any);

      await expect(service.create(dto)).rejects.toBeInstanceOf(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('deve retornar lista de categorias', async () => {
      const list: Category[] = [{ id: 1, nome: 'Doces', receitas: [] } as any];
      (mockRepo.findAll as any).mockResolvedValue(list);

      const result = await service.findAll();
      expect(result).toEqual(list);
      expect(mockRepo.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('deve retornar categoria existente', async () => {
      const entity: Category = { id: 1, nome: 'Doces', receitas: [] } as any;
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
    it('deve atualizar nome da categoria quando informado', async () => {
      const entity: Category = { id: 1, nome: 'Doces', receitas: [] } as any;
      const dto: UpdateCategoryDto = { nome: 'Salgados' };
      (mockRepo.findById as any).mockResolvedValue(entity);
      (mockRepo.save as any).mockImplementation(async (c: Category) => c);

      const result = await service.update(1, dto);
      expect(result.nome).toEqual('Salgados');
      expect(mockRepo.save).toHaveBeenCalled();
    });

    it('deve manter nome quando não informado', async () => {
      const entity: Category = { id: 1, nome: 'Doces', receitas: [] } as any;
      const dto: UpdateCategoryDto = {} as any;
      (mockRepo.findById as any).mockResolvedValue(entity);
      (mockRepo.save as any).mockImplementation(async (c: Category) => c);

      const result = await service.update(1, dto);
      expect(result.nome).toEqual('Doces');
    });
  });

  describe('remove', () => {
    it('deve remover categoria existente', async () => {
      const entity: Category = { id: 1, nome: 'Doces', receitas: [] } as any;
      (mockRepo.findById as any).mockResolvedValue(entity);
      (mockRepo.remove as any).mockResolvedValue(entity);

      await service.remove(1);
      expect(mockRepo.remove).toHaveBeenCalledWith(entity);
    });
  });
});
