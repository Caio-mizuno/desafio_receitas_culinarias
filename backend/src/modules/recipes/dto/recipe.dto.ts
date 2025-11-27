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
  @ApiProperty({
    description: 'Nome da receita',
    example: 'Macarrão com molho branco',
  })
  nome: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'ID da categoria à qual a receita pertence',
    example: 1,
  })
  categoriaId?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'Tempo de preparo em minutos',
    example: 30,
  })
  tempoPreparoMinutos?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'Quantidade de porções',
    example: 4,
  })
  porcoes?: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Modo de preparo da receita',
    example:
      '1. Coloque o macarrão em uma tigela. 2. Adicione o molho branco. 3. Misture bem. 4. Cozinhe por 10 minutos.',
  })
  modoPreparo: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Ingredientes da receita',
    example: 'Macarrão, molho branco, sal, pimenta',
  })
  ingredientes?: string;
}

export class UpdateRecipeDto {
  @IsOptional()
  @IsString()
  @MaxLength(45)
  @ApiProperty({
    description: 'Nome da receita',
    example: 'Macarrão com molho branco',
  })
  nome?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'ID da categoria à qual a receita pertence',
    example: 1,
  })
  categoriaId?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'Tempo de preparo em minutos',
    example: 30,
  })
  tempoPreparoMinutos?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'Quantidade de porções',
    example: 4,
  })
  porcoes?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Modo de preparo da receita',
    example:
      '1. Coloque o macarrão em uma tigela. 2. Adicione o molho branco. 3. Misture bem. 4. Cozinhe por 10 minutos.',
  })
  modoPreparo?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Ingredientes da receita',
    example: 'Macarrão, molho branco, sal, pimenta',
  })
  ingredientes?: string;
}
