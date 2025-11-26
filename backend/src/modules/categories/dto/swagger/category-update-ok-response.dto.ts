import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../entities/category.entity';

export class CategoryUpdateOkResponseDto {
  @ApiProperty({ type: Category })
  response: Category;

  @ApiProperty({ example: 'Categoria atualizada com sucesso' })
  message: string;

  @ApiProperty({ example: true })
  status: boolean;
}

