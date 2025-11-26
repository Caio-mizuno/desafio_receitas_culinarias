import { ApiProperty } from '@nestjs/swagger';

export class RecipeRemoveOkResponseDto {
  @ApiProperty({ example: null })
  response: any;

  @ApiProperty({ example: 'Receita removida com sucesso' })
  message: string;

  @ApiProperty({ example: true })
  status: boolean;
}

