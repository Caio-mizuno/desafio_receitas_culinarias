import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from '../entities/recipe.entity';

@Injectable()
export class RecipesRepository {
  constructor(
    @InjectRepository(Recipe)
    private readonly typeOrmRepository: Repository<Recipe>,
  ) {}

  createEntity(dto: Partial<Recipe>): Recipe {
    return this.typeOrmRepository.create(dto);
  }

  async save(recipe: Recipe): Promise<Recipe> {
    return this.typeOrmRepository.save(recipe);
  }

  async findAll(query?: {
    categoriaId?: number;
    nome?: string;
    limit?: number;
    usuarioId?: number;
  }): Promise<Recipe[]> {
    const qb = this.typeOrmRepository.createQueryBuilder('recipe');
    qb.leftJoinAndSelect('recipe.categoria', 'categoria');
    qb.leftJoinAndSelect('recipe.usuario', 'usuario');
    qb.orderBy('recipe.criadoEm', 'DESC');

    if (query?.categoriaId) {
      qb.andWhere('recipe.categoriaId = :categoriaId', {
        categoriaId: query.categoriaId,
      });
    }

    if (query?.nome) {
      qb.andWhere('recipe.nome LIKE :nome', { nome: `%${query.nome}%` });
    }
    if (query?.usuarioId) {
      qb.andWhere('recipe.usuarioId = :usuarioId', { usuarioId: query.usuarioId });
    }
    if (query?.limit && query.limit > 0) {
      qb.take(query.limit);
    }
    return qb.getMany();
  }

  async findAllWithPagination(query?: {
    categoriaId?: number;
    nome?: string;
    page?: number;
    limit?: number;
    usuarioId?: number;
  }): Promise<{ items: Recipe[]; total: number }> {
    const qb = this.typeOrmRepository.createQueryBuilder('recipe');
    qb.leftJoinAndSelect('recipe.categoria', 'categoria');
    qb.leftJoinAndSelect('recipe.usuario', 'usuario');
    qb.orderBy('recipe.criadoEm', 'DESC');

    if (query?.categoriaId) {
      qb.andWhere('recipe.categoriaId = :categoriaId', {
        categoriaId: query.categoriaId,
      });
    }

    if (query?.nome) {
      qb.andWhere('recipe.nome LIKE :nome', { nome: `%${query.nome}%` });
    }
    if (query?.usuarioId) {
      qb.andWhere('recipe.usuarioId = :usuarioId', { usuarioId: query.usuarioId });
    }

    const page = query?.page && query.page > 0 ? query.page : 1;
    const limit = query?.limit && query.limit > 0 ? query.limit : 12;
    const skip = (page - 1) * limit;

    qb.skip(skip).take(limit);

    const [items, total] = await qb.getManyAndCount();
    return { items, total };
  }

  async findById(id: number): Promise<Recipe | null> {
    return this.typeOrmRepository.findOne({
      where: { id },
      relations: ['categoria', 'usuario'],
    });
  }

  async remove(recipe: Recipe): Promise<Recipe> {
    return this.typeOrmRepository.remove(recipe);
  }
}
