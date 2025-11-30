import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Category } from '../entities/category.entity';
import {
  CategoryWithCountDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '../dto/category.dto';
import { CategoriesRepository } from '../repositories/categories.repository';

@Injectable()
export class CategoriesService {
  constructor(private categoryRepository: CategoriesRepository) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const existing = await this.categoryRepository.findByName(
      createCategoryDto.nome,
    );
    if (existing) {
      throw new ConflictException('Category already exists');
    }
    const category = this.categoryRepository.createEntity(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findOne(id);
    if (updateCategoryDto.nome) {
      category.nome = updateCategoryDto.nome;
    }
    return this.categoryRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
  }

  async countByRecipes(): Promise<CategoryWithCountDto[]> {
    return this.categoryRepository.countByRecipes();
  }
}
