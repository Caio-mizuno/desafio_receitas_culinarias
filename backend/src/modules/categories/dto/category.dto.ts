import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';
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

export class CategoryWithCountDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'ID da categoria',
    example: 1,
  })
  id: number;

  @IsString()
  nome: string;

  @IsNotEmpty()
  @IsNumber()
  receitasContagem: number;
}
