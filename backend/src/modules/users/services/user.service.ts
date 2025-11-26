import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dtos/create-user';
import { UpdateUserDto } from '../dtos/update-user.dto';
import * as bcrypt from 'bcrypt';
import { SALTS_OR_ROUNDS } from 'src/common/constants/salts-or-rounds.constants';
import { UsersRepository } from '../repositories/users.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findByLogin(
      createUserDto.login,
    );

    if (existingUser) {
      throw new ConflictException('Login already exists');
    }

    const hashedPassword = await bcrypt.hash(
      createUserDto.senha,
      SALTS_OR_ROUNDS,
    );

    const user = this.userRepository.createEntity({
      ...createUserDto,
      senha: hashedPassword,
    });

    return this.userRepository.create(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByLogin(login: string): Promise<User | undefined> {
    const user = await this.userRepository.findByLogin(login);
    return user || undefined;
  }

  // Used by AuthModule to validate password
  async validateUser(login: string, pass: string): Promise<User | null> {
    const user = await this.findByLogin(login);
    if (user && (await bcrypt.compare(pass, user.senha))) {
      return user;
    }
    return null;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.senha) {
      updateUserDto.senha = await bcrypt.hash(
        updateUserDto.senha,
        SALTS_OR_ROUNDS,
      );
    }

    return this.userRepository.update(user, updateUserDto);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}
