import { ApiProperty } from '@nestjs/swagger';
import { Recipe } from '../../entities/recipe.entity';

export class RecipesListOkResponseDto {
  @ApiProperty({ type: Recipe, isArray: true })
  response: Recipe[];

  @ApiProperty({ example: 'Receitas listadas com sucesso' })
  message: string;

  @ApiProperty({ example: true })
  status: boolean;
}
