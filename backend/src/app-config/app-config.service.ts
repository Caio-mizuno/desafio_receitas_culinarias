import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly config: ConfigService) {}

  get nodeEnv(): string {
    return this.config.get<string>('NODE_ENV');
  }

  get appPort(): number {
    return this.config.get<number>('APP_PORT');
  }

  get dbHost(): string {
    return this.config.get<string>('DB_HOST');
  }

  get dbPort(): number {
    return this.config.get<number>('DB_PORT');
  }

  get dbUsername(): string {
    return this.config.get<string>('DB_USERNAME');
  }

  get dbPassword(): string {
    return this.config.get<string>('DB_PASSWORD');
  }

  get dbDatabase(): string {
    return this.config.get<string>('DB_DATABASE');
  }

  get dbDatabaseTest(): string {
    return this.config.get<string>('DB_DATABASE_TEST');
  }

  get emailHost(): string {
    return this.config.get<string>('EMAIL_HOST');
  }

  get emailUser(): string {
    return this.config.get<string>('EMAIL_USER');
  }

  get emailPass(): string {
    return this.config.get<string>('EMAIL_PASS');
  }

  get jwtExpiresIn(): string {
    return this.config.get<string>('JWT_EXPIRES_IN');
  }

  get jwtSecret(): string {
    return this.config.get<string>('JWT_SECRET');
  }

  get corsOrigins(): string[] {
    const raw = this.config.get<string>('CORS_ORIGINS');
    if (!raw) return [];
    return raw
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }

  get corsCredentials(): boolean {
    const raw = this.config.get<string>('CORS_CREDENTIALS');
    return raw === 'true' || raw === '1';
  }
}
