import { ApiProperty } from '@nestjs/swagger';
import { Recipe } from '../../entities/recipe.entity';

export class RecipeGetOkResponseDto {
  @ApiProperty({ type: Recipe })
  response: Recipe;

  @ApiProperty({ example: 'Receita encontrada com sucesso' })
  message: string;

  @ApiProperty({ example: true })
  status: boolean;
}

