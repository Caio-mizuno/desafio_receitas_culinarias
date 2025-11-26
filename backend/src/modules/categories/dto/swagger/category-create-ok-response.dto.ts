import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../entities/category.entity';

export class CategoryCreateOkResponseDto {
  @ApiProperty({ type: Category })
  response: Category;

  @ApiProperty({ example: 'Categoria criada com sucesso!' })
  message: string;

  @ApiProperty({ example: true })
  status: boolean;
}

