import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../entities/user.entity';

export class UserUpdateOkResponseDto {
  @ApiProperty({ type: User })
  response: User;

  @ApiProperty({ example: 'Usuário atualizado com sucesso' })
  message: string;

  @ApiProperty({ example: true })
  status: boolean;
}

