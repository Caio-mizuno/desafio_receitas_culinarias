import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dtos/login.dto';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    signIn: jest.fn(),
    logout: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    it('should sign in and return token payload', async () => {
      const dto: LoginDto = { login: 'user', senha: 'pass' };
      const result = { access_token: 'token', expires_in: 3600 };
      mockAuthService.signIn.mockResolvedValue(result);
      const wrapped = await controller.signIn(dto);
      expect(wrapped).toEqual({
        response: result,
        message: 'Login realizado com sucesso',
        status: true,
      });
      expect(mockAuthService.signIn).toHaveBeenCalledWith(dto.login, dto.senha);
    });
  });

  describe('logout', () => {
    it('should logout and return message', async () => {
      const result = { message: 'Logout realizado com sucesso' };
      mockAuthService.logout.mockResolvedValue(result);
      const wrapped = await controller.logout();
      expect(wrapped).toEqual({
        response: result,
        message: 'Logout realizado com sucesso',
        status: true,
      });
      expect(mockAuthService.logout).toHaveBeenCalledTimes(1);
    });
  });
});
