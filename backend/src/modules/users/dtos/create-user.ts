import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  nome: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  login: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(6, 100)
  senha: string;
}
