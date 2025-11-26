import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from 'src/modules/users/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService } from 'src/app-config/app-config.service';

describe('AuthService', () => {
  let service: AuthService;

  const mockUserService = {
    validateUser: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn().mockResolvedValue('mockJwtToken'),
  };

  const mockAppConfigService = {
    jwtExpiresIn: 18000,
    jwtSecret: 'mockJwtSecret',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: AppConfigService, useValue: mockAppConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should return jwt token and expires', async () => {
    const user = { id: 1, login: 'user', senha: 'hashed' } as any;
    mockUserService.validateUser.mockResolvedValue(user);

    const token = await service.signIn('user', 'pass');

    expect(token).toEqual({ access_token: 'mockJwtToken', expires_in: 18000 });
    expect(mockUserService.validateUser).toHaveBeenCalledWith('user', 'pass');
  });
});
