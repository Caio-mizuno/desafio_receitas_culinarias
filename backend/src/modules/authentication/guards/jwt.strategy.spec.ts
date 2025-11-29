import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UnauthorizedException } from '@nestjs/common';
import { User } from 'src/modules/users/entities/user.entity';
import { AppConfigService } from 'src/app-config/app-config.service';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let userRepository: Repository<User>;

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  const mockConfigService = {
    jwtSecret: 'test-secret',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: AppConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jest.clearAllMocks();
  });

  it('deve ser definido', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('deve retornar usuário quando encontrado pelo id no payload', async () => {
      const user = { id: 1, nome: 'Test', login: 'test' } as User;
      const payload = { sub: 1 };

      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await strategy.validate(payload);

      expect(result).toEqual(user);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('deve lançar UnauthorizedException quando usuário não for encontrado', async () => {
      const payload = { sub: 999 };

      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(strategy.validate(payload)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
      });
    });

    it('deve lançar UnauthorizedException quando payload não contém sub', async () => {
      const payload = {};

      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(strategy.validate(payload)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
