import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(64)
  @Matches(/\S/, { message: 'login must contain non-whitespace characters' })
  @ApiProperty({
    description:
      'Login do usuário (username ou e-mail, conforme política de autenticação)',
    example: 'caio.dev',
  })
  login: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(128)
  @Matches(/\S/, { message: 'senha must contain non-whitespace characters' })
  @ApiProperty({
    description: 'Senha do usuário em texto simples.',
    example: 'admin',
  })
  senha: string;
}
