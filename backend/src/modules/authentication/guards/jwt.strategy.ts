import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { UnauthorizedException, Injectable } from '@nestjs/common';
import { User } from 'src/modules/users/entities/user.entity';
import { AppConfigService } from 'src/app-config/app-config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly appConfigService: AppConfigService,
  ) {
    super({
      secretOrKey: appConfigService.jwtSecret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
    });
  }

  async validate(payload: any): Promise<User> {
    const { sub } = payload;
    const user: User = await this.userRepository.findOne({
      where: { id: sub },
    });

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
