import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Nome da categoria',
    example: 'Carnes',
  })
  nome: string;
}

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Nome da categoria',
    example: 'Carnes',
  })
  nome?: string;
}
