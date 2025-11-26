import { ApiProperty } from '@nestjs/swagger';

export class CategoryRemoveOkResponseDto {
  @ApiProperty({ example: null })
  response: any;

  @ApiProperty({ example: 'Categoria removida com sucesso' })
  message: string;

  @ApiProperty({ example: true })
  status: boolean;
}

