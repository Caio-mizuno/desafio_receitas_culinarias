import { ApiProperty } from '@nestjs/swagger';

class TokenResponseDto {
  @ApiProperty({ description: 'Token JWT de acesso' })
  access_token: string;

  @ApiProperty({ description: 'Tempo de expiração do token conforme configuração da aplicação', example: '3600s' })
  expires_in: string;
}

export class LoginOkResponseDto {
  @ApiProperty({ type: TokenResponseDto })
  response: TokenResponseDto;

  @ApiProperty({ example: 'Login realizado com sucesso' })
  message: string;

  @ApiProperty({ example: true })
  status: boolean;
}

