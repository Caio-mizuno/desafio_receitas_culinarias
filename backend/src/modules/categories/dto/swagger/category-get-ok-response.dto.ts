import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../entities/category.entity';

export class CategoryGetOkResponseDto {
  @ApiProperty({ type: Category })
  response: Category;

  @ApiProperty({ example: 'Categoria encontrada com sucesso' })
  message: string;

  @ApiProperty({ example: true })
  status: boolean;
}

