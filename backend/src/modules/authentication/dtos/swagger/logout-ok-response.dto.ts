import { ApiProperty } from '@nestjs/swagger';

class LogoutMessageDto {
  @ApiProperty({ example: 'Logout realizado com sucesso' })
  message: string;
}

export class LogoutOkResponseDto {
  @ApiProperty({ type: LogoutMessageDto })
  response: LogoutMessageDto;

  @ApiProperty({ example: 'Logout realizado com sucesso' })
  message: string;

  @ApiProperty({ example: true })
  status: boolean;
}
