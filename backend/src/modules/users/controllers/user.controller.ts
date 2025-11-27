import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto } from '../dtos/create-user';
import { JwtAuthGuard } from '../../authentication/guards/auth.guard';
import { Public } from 'src/common/decorators/is-public.decorator';
import { DefaultResponseDto } from 'src/common/dtos/default-response.dto';
import { UserCreateOkResponseDto } from '../dtos/swagger/user-create-ok-response.dto';
import { UsersListOkResponseDto } from '../dtos/swagger/users-list-ok-response.dto';
import { UserProfileOkResponseDto } from '../dtos/swagger/user-profile-ok-response.dto';
import { UserGetOkResponseDto } from '../dtos/swagger/user-get-ok-response.dto';
import { UserUpdateOkResponseDto } from '../dtos/swagger/user-update-ok-response.dto';
import { UserRemoveOkResponseDto } from '../dtos/swagger/user-remove-ok-response.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  @ApiOkResponse({ description: 'Usuário criado com sucesso', type: UserCreateOkResponseDto })
  async create(@Body() createUserDto: CreateUserDto) {
    const res = await this.userService.create(createUserDto);
    return new DefaultResponseDto(res, 'Usuário criado com sucesso', true);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOkResponse({ description: 'Usuários listados com sucesso', type: UsersListOkResponseDto })
  async findAll() {
    const res = await this.userService.findAll();
    return new DefaultResponseDto(res, 'Usuários listados com sucesso', true);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOkResponse({ description: 'Perfil obtido com sucesso', type: UserProfileOkResponseDto })
  getProfile(@Request() req) {
    return new DefaultResponseDto(req.user, 'Perfil obtido com sucesso', true);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOkResponse({ description: 'Usuário encontrado com sucesso', type: UserGetOkResponseDto })
  async findOne(@Param('id') id: string) {
    const res = await this.userService.findOne(+id);
    return new DefaultResponseDto(res, 'Usuário encontrado com sucesso', true);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOkResponse({ description: 'Usuário atualizado com sucesso', type: UserUpdateOkResponseDto })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const res = await this.userService.update(+id, updateUserDto);
    return new DefaultResponseDto(res, 'Usuário atualizado com sucesso', true);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOkResponse({ description: 'Usuário removido com sucesso', type: UserRemoveOkResponseDto })
  async remove(@Param('id') id: string) {
    await this.userService.remove(+id);
    return new DefaultResponseDto(null, 'Usuário removido com sucesso', true);
  }
}
