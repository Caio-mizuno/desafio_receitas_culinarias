import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/modules/users/services/user.service';
import { AppConfigService } from 'src/app-config/app-config.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly appConfigService: AppConfigService,
  ) {}

  async signIn(login: string, pass: string): Promise<any> {
    const user = await this.userService.validateUser(login, pass);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user.id, username: user.login };
    return {
      access_token: await this.jwtService.signAsync(payload),
      expires_in: this.appConfigService.jwtExpiresIn,
    };
  }

  async logout(): Promise<{ message: string }> {
    return { message: 'Logout realizado com sucesso' };
  }
}
