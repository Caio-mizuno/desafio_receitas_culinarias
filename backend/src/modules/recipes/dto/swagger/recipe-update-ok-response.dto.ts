import { ApiProperty } from '@nestjs/swagger';
import { Recipe } from '../../entities/recipe.entity';

export class RecipeUpdateOkResponseDto {
  @ApiProperty({ type: Recipe })
  response: Recipe;

  @ApiProperty({ example: 'Receita atualizada com sucesso' })
  message: string;

  @ApiProperty({ example: true })
  status: boolean;
}

