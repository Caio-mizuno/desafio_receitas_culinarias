import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../entities/user.entity';

export class UsersListOkResponseDto {
  @ApiProperty({ type: User, isArray: true })
  response: User[];

  @ApiProperty({ example: 'Usuários listados com sucesso' })
  message: string;

  @ApiProperty({ example: true })
  status: boolean;
}

