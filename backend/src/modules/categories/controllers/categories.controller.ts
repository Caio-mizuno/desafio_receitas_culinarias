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
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from '../services/categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';
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
  @ApiOkResponse({ description: 'Categoria criada com sucesso', type: CategoryCreateOkResponseDto })
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
  @ApiOkResponse({ description: 'Categorias listadas com sucesso', type: CategoriesListOkResponseDto })
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
  @ApiOkResponse({ description: 'Categoria encontrada com sucesso', type: CategoryGetOkResponseDto })
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
  @ApiOkResponse({ description: 'Categoria atualizada com sucesso', type: CategoryUpdateOkResponseDto })
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
  @ApiOkResponse({ description: 'Categoria removida com sucesso', type: CategoryRemoveOkResponseDto })
  @HandleErrors()
  remove(@Param('id') id: string) {
    return this.categoriesService
      .remove(+id)
      .then(
        () =>
          new DefaultResponseDto(null, 'Categoria removida com sucesso', true),
      );
  }
}
