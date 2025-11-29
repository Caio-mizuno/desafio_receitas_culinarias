import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CategoriesService } from '../services/categories.service';
import { CategoryWithCountDto, CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';
import { JwtAuthGuard } from '../../authentication/guards/auth.guard';
import { Public } from 'src/common/decorators/is-public.decorator';
import { DefaultResponseDto } from 'src/common/dtos/default-response.dto';
import { HandleErrors } from 'src/common/decorators/handle-errors.decorator';
import { CategoryCreateOkResponseDto } from '../dto/swagger/category-create-ok-response.dto';
import { CategoriesListOkResponseDto } from '../dto/swagger/categories-list-ok-response.dto';
import { CategoryGetOkResponseDto } from '../dto/swagger/category-get-ok-response.dto';
import { CategoryUpdateOkResponseDto } from '../dto/swagger/category-update-ok-response.dto';
import { CategoryRemoveOkResponseDto } from '../dto/swagger/category-remove-ok-response.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({
    summary: 'Cria uma nova categoria',
    description: 'Cria uma nova categoria com base nos dados fornecidos.',
  })
  @ApiBody({
    type: CreateCategoryDto,
    description: 'Dados da categoria para criação',
  })
  @ApiOkResponse({
    description: 'Categoria criada com sucesso',
    type: CategoryCreateOkResponseDto,
  })
  @HandleErrors()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService
      .create(createCategoryDto)
      .then(
        (res) =>
          new DefaultResponseDto(res, 'Categoria criada com sucesso', true),
      );
  }

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Lista todas as categorias',
    description: 'Retorna uma lista de todas as categorias cadastradas.',
  })
  @ApiOkResponse({
    description: 'Categorias listadas com sucesso',
    type: CategoriesListOkResponseDto,
  })
  @HandleErrors()
  findAll() {
    return this.categoriesService
      .findAll()
      .then(
        (res) =>
          new DefaultResponseDto(res, 'Categorias listadas com sucesso', true),
      );
  }

  @Public()
  @Get(':id')
  @ApiOperation({
    summary: 'Busca uma categoria pelo ID',
    description:
      'Retorna os detalhes de uma categoria específica baseada no ID fornecido.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da categoria',
    type: 'integer',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Categoria encontrada com sucesso',
    type: CategoryGetOkResponseDto,
  })
  @HandleErrors()
  findOne(@Param('id') id: string) {
    return this.categoriesService
      .findOne(+id)
      .then(
        (res) =>
          new DefaultResponseDto(res, 'Categoria encontrada com sucesso', true),
      );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({
    summary: 'Atualiza uma categoria',
    description:
      'Atualiza os dados de uma categoria existente baseada no ID fornecido.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da categoria a ser atualizada',
    type: 'integer',
    example: 1,
  })
  @ApiBody({
    type: UpdateCategoryDto,
    description: 'Dados da categoria para atualização',
  })
  @ApiOkResponse({
    description: 'Categoria atualizada com sucesso',
    type: CategoryUpdateOkResponseDto,
  })
  @HandleErrors()
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService
      .update(+id, updateCategoryDto)
      .then(
        (res) =>
          new DefaultResponseDto(res, 'Categoria atualizada com sucesso', true),
      );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({
    summary: 'Remove uma categoria',
    description: 'Remove uma categoria existente baseada no ID fornecido.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da categoria a ser removida',
    type: 'integer',
    example: 1,
  })
  @ApiOkResponse({
    description: 'Categoria removida com sucesso',
    type: CategoryRemoveOkResponseDto,
  })
  @HandleErrors()
  remove(@Param('id') id: string) {
    return this.categoriesService
      .remove(+id)
      .then(
        () =>
          new DefaultResponseDto(null, 'Categoria removida com sucesso', true),
      );
  }

  @Public()
  @Get('count/recipes')
  @ApiOperation({
    summary: 'Retorna categorias com a contagem de receitas',
  })
  @ApiOkResponse({
    description: 'Lista de categorias com contagem de receitas',
    type: [CategoryWithCountDto],
  })
  @HandleErrors()
  async countByRecipes() {
    const result = await this.categoriesService.countByRecipes();
    return new DefaultResponseDto(
      result,
      'Contagem de categorias por receitas retornada com sucesso',
      true,
    );
  }
}
