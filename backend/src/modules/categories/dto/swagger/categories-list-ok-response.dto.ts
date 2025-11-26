import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../entities/category.entity';

export class CategoriesListOkResponseDto {
  @ApiProperty({ type: Category, isArray: true })
  response: Category[];

  @ApiProperty({ example: 'Categorias listadas com sucesso' })
  message: string;

  @ApiProperty({ example: true })
  status: boolean;
}

