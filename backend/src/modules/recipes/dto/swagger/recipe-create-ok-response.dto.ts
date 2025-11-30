import { ApiProperty } from '@nestjs/swagger';
import { Recipe } from '../../entities/recipe.entity';

export class RecipeCreateOkResponseDto {
  @ApiProperty({ type: Recipe })
  response: Recipe;

  @ApiProperty({ example: 'Receita criada com sucesso' })
  message: string;

  @ApiProperty({ example: true })
  status: boolean;
}
