import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { Public } from 'src/common/decorators/is-public.decorator';
import { LoginDto } from '../dtos/login.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/auth.guard';
import { DefaultResponseDto } from 'src/common/dtos/default-response.dto';
import { HandleErrors } from 'src/common/decorators/handle-errors.decorator';
import { LoginOkResponseDto } from '../dtos/swagger/login-ok-response.dto';
import { LogoutOkResponseDto } from '../dtos/swagger/logout-ok-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('login')
  @ApiOperation({
    summary: 'Realiza login e retorna token JWT',
    description:
      'Valida as credenciais e retorna o token de acesso (JWT) e o tempo de expiração definido pela aplicação.',
  })
  @ApiBody({
    type: LoginDto,
    description: 'Credenciais do usuário para autenticação',
  })
  @ApiOkResponse({
    description: 'Login realizado com sucesso',
    type: LoginOkResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Credenciais inválidas',
  })
  @ApiBadRequestResponse({
    description: 'Dados de entrada inválidos (falha de validação)',
  })
  @HandleErrors()
  async signIn(@Body() signInDto: LoginDto) {
    const result = await this.authService.signIn(
      signInDto.login,
      signInDto.senha,
    );
    return new DefaultResponseDto(result, 'Login realizado com sucesso', true);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiOperation({ summary: 'Realiza logout' })
  @ApiOkResponse({
    description: 'Logout realizado com sucesso',
    type: LogoutOkResponseDto,
  })
  @HandleErrors()
  async logout() {
    const result = await this.authService.logout();
    return new DefaultResponseDto(result, 'Logout realizado com sucesso', true);
  }
}
