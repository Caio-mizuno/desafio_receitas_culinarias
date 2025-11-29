import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { UsersRepository } from './repositories/users.repository';
import { RecipesModule } from '../recipes/recipes.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RecipesModule],
  providers: [UserService, UsersRepository],
  controllers: [UserController],
  exports: [UserService, UsersRepository],
})
export class UserModule {}
