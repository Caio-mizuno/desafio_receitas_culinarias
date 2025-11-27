import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from '../dtos/create-user';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly typeOrmRepository: Repository<User>,
  ) {}

  async findByLogin(login: string): Promise<User | null> {
    return this.typeOrmRepository.findOne({ where: { login } });
  }

  async create(user: User): Promise<User> {
    return this.typeOrmRepository.save(user);
  }

  createEntity(dto: Partial<User>): User {
    return this.typeOrmRepository.create(dto);
  }

  async findAll(): Promise<User[]> {
    return this.typeOrmRepository.find();
  }

  async findById(id: number): Promise<User | null> {
    return this.typeOrmRepository.findOne({ where: { id } });
  }

  async update(user: User, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = this.typeOrmRepository.merge(user, updateUserDto);
    return this.typeOrmRepository.save(updatedUser);
  }

  async remove(user: User): Promise<User> {
    return this.typeOrmRepository.remove(user);
  }
}
