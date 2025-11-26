import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { RecipesService } from '../services/recipes.service';
import { CreateRecipeDto, UpdateRecipeDto } from '../dto/recipe.dto';
import { JwtAuthGuard } from '../../authentication/guards/auth.guard';
import { Public } from 'src/common/decorators/is-public.decorator';
import { DefaultResponseDto } from 'src/common/dtos/default-response.dto';
import { RecipeCreateOkResponseDto } from '../dto/swagger/recipe-create-ok-response.dto';
import { RecipesListOkResponseDto } from '../dto/swagger/recipes-list-ok-response.dto';
import { RecipeGetOkResponseDto } from '../dto/swagger/recipe-get-ok-response.dto';
import { RecipeUpdateOkResponseDto } from '../dto/swagger/recipe-update-ok-response.dto';
import { RecipeRemoveOkResponseDto } from '../dto/swagger/recipe-remove-ok-response.dto';

@ApiTags('Recipes')
@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOkResponse({ description: 'Receita criada com sucesso', type: RecipeCreateOkResponseDto })
  create(@Body() createRecipeDto: CreateRecipeDto, @Request() req) {
    return this.recipesService
      .create(createRecipeDto, req.user)
      .then(
        (res) =>
          new DefaultResponseDto(res, 'Receita criada com sucesso', true),
      );
  }

  @Public()
  @Get()
  @ApiQuery({ name: 'categoriaId', required: false, type: Number })
  @ApiQuery({ name: 'nome', required: false, type: String })
  @ApiOkResponse({ description: 'Receitas listadas com sucesso', type: RecipesListOkResponseDto })
  findAll(
    @Query('categoriaId') categoriaId?: number,
    @Query('nome') nome?: string,
  ) {
    return this.recipesService
      .findAll({ categoriaId, nome })
      .then(
        (res) =>
          new DefaultResponseDto(res, 'Receitas listadas com sucesso', true),
      );
  }

  @Public()
  @Get(':id')
  @ApiOkResponse({ description: 'Receita encontrada com sucesso', type: RecipeGetOkResponseDto })
  findOne(@Param('id') id: string) {
    return this.recipesService
      .findOne(+id)
      .then(
        (res) =>
          new DefaultResponseDto(res, 'Receita encontrada com sucesso', true),
      );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOkResponse({ description: 'Receita atualizada com sucesso', type: RecipeUpdateOkResponseDto })
  update(
    @Param('id') id: string,
    @Body() updateRecipeDto: UpdateRecipeDto,
    @Request() req,
  ) {
    return this.recipesService
      .update(+id, updateRecipeDto, req.user)
      .then(
        (res) =>
          new DefaultResponseDto(res, 'Receita atualizada com sucesso', true),
      );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOkResponse({ description: 'Receita removida com sucesso', type: RecipeRemoveOkResponseDto })
  remove(@Param('id') id: string, @Request() req) {
    return this.recipesService
      .remove(+id, req.user)
      .then(
        () =>
          new DefaultResponseDto(null, 'Receita removida com sucesso', true),
      );
  }
}
