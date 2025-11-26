import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  nome: string;
}

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  nome?: string;
}
