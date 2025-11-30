import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../entities/user.entity';

export class UserCreateOkResponseDto {
  @ApiProperty({ type: User })
  response: User;

  @ApiProperty({ example: 'Usuário criado com sucesso' })
  message: string;

  @ApiProperty({ example: true })
  status: boolean;
}
