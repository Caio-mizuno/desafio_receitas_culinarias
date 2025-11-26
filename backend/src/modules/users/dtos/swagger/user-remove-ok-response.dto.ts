import { ApiProperty } from '@nestjs/swagger';

export class UserRemoveOkResponseDto {
  @ApiProperty({ example: null })
  response: any;

  @ApiProperty({ example: 'Usuário removido com sucesso' })
  message: string;

  @ApiProperty({ example: true })
  status: boolean;
}

