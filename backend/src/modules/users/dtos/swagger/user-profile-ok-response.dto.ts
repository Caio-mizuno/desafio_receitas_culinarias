import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../entities/user.entity';

class UserProfileWithStatsDto extends User {
  @ApiProperty({ example: 12 })
  receitasCriadas: number;

  @ApiProperty({ example: 5 })
  categoriasUtilizadas: number;
}

export class UserProfileOkResponseDto {
  @ApiProperty({ type: UserProfileWithStatsDto })
  response: UserProfileWithStatsDto;

  @ApiProperty({ example: 'Perfil obtido com sucesso' })
  message: string;

  @ApiProperty({ example: true })
  status: boolean;
}
