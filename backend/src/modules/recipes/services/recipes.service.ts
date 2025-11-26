import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Recipe } from '../entities/recipe.entity';
import { CreateRecipeDto, UpdateRecipeDto } from '../dto/recipe.dto';
import { User } from '../../users/entities/user.entity';
import { RecipesRepository } from '../repositories/recipes.repository';

@Injectable()
export class RecipesService {
  constructor(private recipeRepository: RecipesRepository) {}

  async create(createRecipeDto: CreateRecipeDto, user: User): Promise<Recipe> {
    const recipe = this.recipeRepository.createEntity({
      ...createRecipeDto,
      usuarioId: user.id,
    });
    return this.recipeRepository.save(recipe);
  }

  async findAll(query?: {
    categoriaId?: number;
    nome?: string;
  }): Promise<Recipe[]> {
    return this.recipeRepository.findAll(query);
  }

  async findOne(id: number): Promise<Recipe> {
    const recipe = await this.recipeRepository.findById(id);
    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }
    return recipe;
  }

  async update(
    id: number,
    updateRecipeDto: UpdateRecipeDto,
    user: User,
  ): Promise<Recipe> {
    const recipe = await this.findOne(id);

    if (recipe.usuarioId !== user.id) {
      throw new ForbiddenException('You can only update your own recipes');
    }

    Object.assign(recipe, updateRecipeDto);
    return this.recipeRepository.save(recipe);
  }

  async remove(id: number, user: User): Promise<void> {
    const recipe = await this.findOne(id);

    if (recipe.usuarioId !== user.id) {
      throw new ForbiddenException('You can only delete your own recipes');
    }

    await this.recipeRepository.remove(recipe);
  }
}
