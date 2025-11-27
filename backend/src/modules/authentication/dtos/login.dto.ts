import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Login do usuário (username ou e-mail, conforme política de autenticação)',
    example: 'caio.dev',
  })
  login: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Senha do usuário em texto simples (será validada e nunca armazenada).',
    example: 'admin',
  })
  senha: string;
}
