import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRecipeDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(45)
  @ApiProperty()
  nome: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  categoriaId?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  tempoPreparoMinutos?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  porcoes?: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  modoPreparo: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  ingredientes?: string;
}

export class UpdateRecipeDto {
  @IsOptional()
  @IsString()
  @MaxLength(45)
  @ApiProperty()
  nome?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  categoriaId?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  tempoPreparoMinutos?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  porcoes?: number;

  @IsOptional()
  @IsString()
  @ApiProperty()
  modoPreparo?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  ingredientes?: string;
}
