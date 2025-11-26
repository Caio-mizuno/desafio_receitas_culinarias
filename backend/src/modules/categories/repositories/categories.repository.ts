import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from '../dto/category.dto';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectRepository(Category)
    private readonly typeOrmRepository: Repository<Category>,
  ) {}

  async findByName(nome: string): Promise<Category | null> {
    return this.typeOrmRepository.findOne({ where: { nome } });
  }

  createEntity(dto: CreateCategoryDto): Category {
    return this.typeOrmRepository.create(dto);
  }

  async save(category: Category): Promise<Category> {
    return this.typeOrmRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return this.typeOrmRepository.find();
  }

  async findById(id: number): Promise<Category | null> {
    return this.typeOrmRepository.findOne({ where: { id } });
  }

  async remove(category: Category): Promise<Category> {
    return this.typeOrmRepository.remove(category);
  }
}
