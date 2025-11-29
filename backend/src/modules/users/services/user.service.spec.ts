import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UsersRepository } from '../repositories/users.repository';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, UpdateUserDto } from '../dtos/create-user';
import { User } from '../entities/user.entity';

describe('UserService', () => {
  let service: UserService;

  const mockRepo = {
    findByLogin: jest.fn(),
    createEntity: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  } as unknown as jest.Mocked<UsersRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: UsersRepository, useValue: mockRepo }],
    }).compile();

    service = module.get<UserService>(UserService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve lançar ConflictException quando login já existir', async () => {
      const dto: CreateUserDto = { nome: 'A', login: 'a', senha: 'x' };
      (mockRepo.findByLogin as any).mockResolvedValue({ id: 1 } as any);

      await expect(service.create(dto)).rejects.toBeInstanceOf(ConflictException);
    });

    it('deve criar usuário com senha hash e retornar entidade', async () => {
      const dto: CreateUserDto = { nome: 'A', login: 'a', senha: 'x' };
      const hashed = 'hashed';
      jest.spyOn(bcrypt, 'hash').mockImplementation(async () => hashed);
      (mockRepo.findByLogin as any).mockResolvedValue(null);
      (mockRepo.createEntity as any).mockImplementation((payload: Partial<User>) => ({ id: 1, ...payload } as any));
      (mockRepo.create as any).mockResolvedValue({ id: 1, login: 'a', senha: hashed } as any);

      const result = await service.create(dto);
      expect(result.senha).toEqual(hashed);
      expect(mockRepo.createEntity).toHaveBeenCalled();
      expect(mockRepo.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('deve retornar lista de usuários', async () => {
      const list: User[] = [{ id: 1 } as any];
      (mockRepo.findAll as any).mockResolvedValue(list);
      const result = await service.findAll();
      expect(result).toEqual(list);
    });
  });

  describe('findOne', () => {
    it('deve retornar usuário existente', async () => {
      const entity: User = { id: 1 } as any;
      (mockRepo.findById as any).mockResolvedValue(entity);
      const result = await service.findOne(1);
      expect(result).toEqual(entity);
    });

    it('deve lançar NotFoundException quando não encontrado', async () => {
      (mockRepo.findById as any).mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('findByLogin', () => {
    it('deve retornar undefined quando não houver', async () => {
      (mockRepo.findByLogin as any).mockResolvedValue(null);
      const result = await service.findByLogin('login');
      expect(result).toBeUndefined();
    });
  });

  describe('validateUser', () => {
    it('deve retornar usuário quando senha corresponder', async () => {
      const user: User = { id: 1, login: 'a', senha: 'hashed' } as any;
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);
      jest.spyOn(service, 'findByLogin').mockResolvedValue(user);

      const result = await service.validateUser('a', 'x');
      expect(result).toEqual(user);
    });

    it('deve retornar null quando senha não corresponder', async () => {
      const user: User = { id: 1, login: 'a', senha: 'hashed' } as any;
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);
      jest.spyOn(service, 'findByLogin').mockResolvedValue(user);

      const result = await service.validateUser('a', 'x');
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('deve atualizar usuário e hashear senha quando fornecida', async () => {
      const entity: User = { id: 1, login: 'a', senha: 'old' } as any;
      const dto: UpdateUserDto = { nome: 'Novo', senha: 'nova' } as any;
      jest.spyOn(bcrypt, 'hash').mockImplementation(async () => 'hashed');
      (mockRepo.findById as any).mockResolvedValue(entity);
      (mockRepo.update as any).mockResolvedValue({ ...entity, ...dto, senha: 'hashed' } as any);

      const result = await service.update(1, dto);
      expect(result.senha).toEqual('hashed');
      expect(mockRepo.update).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deve remover usuário existente', async () => {
      const entity: User = { id: 1 } as any;
      (mockRepo.findById as any).mockResolvedValue(entity);
      (mockRepo.remove as any).mockResolvedValue(entity);

      await service.remove(1);
      expect(mockRepo.remove).toHaveBeenCalledWith(entity);
    });
  });
});
