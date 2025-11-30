import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nome do usuário',
    example: 'Caio Mizuno',
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  nome: string;

  @ApiProperty({
    description:
      'Login do usuário (username ou e-mail, conforme política de autenticação)',
    example: 'caio.dev',
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  login: string;

  @ApiProperty({
    description: 'Senha do usuário (mínimo 6 caracteres)',
    example: 'password123',
  })
  @IsNotEmpty()
  @IsString()
  @Length(5, 100)
  senha: string;
}

export class UpdateUserDto {
  @ApiProperty({
    description: 'Nome do usuário',
    example: 'Caio Mizuno',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(3, 100)
  nome?: string;

  @ApiProperty({
    description:
      'Login do usuário (username ou e-mail, conforme política de autenticação)',
    example: 'caio.dev',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(3, 100)
  login?: string;

  @ApiProperty({
    description: 'Senha do usuário (mínimo 6 caracteres)',
    example: 'password123',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(6, 100)
  senha?: string;
}
