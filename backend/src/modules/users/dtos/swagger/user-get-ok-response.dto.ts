import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../entities/user.entity';

export class UserGetOkResponseDto {
  @ApiProperty({ type: User })
  response: User;

  @ApiProperty({ example: 'Usuário encontrado com sucesso' })
  message: string;

  @ApiProperty({ example: true })
  status: boolean;
}
