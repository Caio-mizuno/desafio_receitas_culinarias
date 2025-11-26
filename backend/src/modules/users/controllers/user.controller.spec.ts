import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dtos/create-user';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from '../dtos/update-user.dto';

describe('UserController', () => {
  let controller: UserController;

  const mockUserService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        nome: 'Test User',
        login: 'testuser',
        senha: 'password123',
      };

      const result: User = {
        id: 1,
        ...createUserDto,
        criadoEm: new Date(),
        alteradoEm: new Date(),
        receitas: [],
      };

      mockUserService.create.mockResolvedValue(result);

      const wrapped = await controller.create(createUserDto);
      expect(wrapped).toEqual({
        response: result,
        message: 'Usuário criado com sucesso',
        status: true,
      });
      expect(mockUserService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result: User[] = [
        {
          id: 1,
          nome: 'Test User',
          login: 'testuser',
          senha: 'password123',
          criadoEm: new Date(),
          alteradoEm: new Date(),
          receitas: [],
        },
      ];

      mockUserService.findAll.mockResolvedValue(result);

      const wrappedList = await controller.findAll();
      expect(wrappedList).toEqual({
        response: result,
        message: 'Usuários listados com sucesso',
        status: true,
      });
      expect(mockUserService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const result: User = {
        id: 1,
        nome: 'Test User',
        login: 'testuser',
        senha: 'password123',
        criadoEm: new Date(),
        alteradoEm: new Date(),
        receitas: [],
      };

      mockUserService.findOne.mockResolvedValue(result);

      const wrappedOne = await controller.findOne('1');
      expect(wrappedOne).toEqual({
        response: result,
        message: 'Usuário encontrado com sucesso',
        status: true,
      });
      expect(mockUserService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        nome: 'Updated Name',
      };

      const result: User = {
        id: 1,
        nome: 'Updated Name',
        login: 'testuser',
        senha: 'password123',
        criadoEm: new Date(),
        alteradoEm: new Date(),
        receitas: [],
      };

      mockUserService.update.mockResolvedValue(result);

      const wrappedUpdate = await controller.update('1', updateUserDto);
      expect(wrappedUpdate).toEqual({
        response: result,
        message: 'Usuário atualizado com sucesso',
        status: true,
      });
      expect(mockUserService.update).toHaveBeenCalledWith(1, updateUserDto);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      mockUserService.remove.mockResolvedValue(undefined);

      const wrappedRemove = await controller.remove('1');
      expect(wrappedRemove).toEqual({
        response: null,
        message: 'Usuário removido com sucesso',
        status: true,
      });
      expect(mockUserService.remove).toHaveBeenCalledWith(1);
    });
  });
});
