import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../entities/user.entity';

export class UserProfileOkResponseDto {
  @ApiProperty({ type: User })
  response: User;

  @ApiProperty({ example: 'Perfil obtido com sucesso' })
  message: string;

  @ApiProperty({ example: true })
  status: boolean;
}

