import { Module, OnModuleInit } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/authentication/auth.module';
import { User } from './modules/users/entities/user.entity';
import { AppConfigModule } from './app-config/app-config.module';
import { AppConfigService } from './app-config/app-config.service';
import { MigrationService } from './common/providers/migration.provider';
import { CategoriesModule } from './modules/categories/categories.module';
import { RecipesModule } from './modules/recipes/recipes.module';
import { Category } from './modules/categories/entities/category.entity';
import { Recipe } from './modules/recipes/entities/recipe.entity';
import { JwtAuthGuard } from './modules/authentication/guards/auth.guard';

@Module({
  imports: [
    AppConfigModule,
    MailerModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: async (config: AppConfigService) => ({
        transport: {
          host: config.emailHost,
          port: 587,
          secure: false,
          auth: {
            user: config.emailUser,
            pass: config.emailPass,
          },
        },
      }),
    }),
    TypeOrmModule.forRootAsync({
      inject: [AppConfigService],
      imports: [AppConfigModule],
      useFactory: async (config: AppConfigService) => ({
        type: 'mysql',
        host: config.dbHost,
        port: config.dbPort,
        username: config.dbUsername,
        password: config.dbPassword,
        database:
          config.nodeEnv === 'development' || config.nodeEnv === 'test'
            ? config.dbDatabase
            : config.dbDatabaseTest,

        entities: [User, Category, Recipe],

        synchronize:
          config.nodeEnv === 'development' || config.nodeEnv === 'test'
            ? true
            : false,

        logging:
          config.nodeEnv === 'development' || config.nodeEnv === 'test'
            ? true
            : false,

        dropSchema: false,
        migrations: [`${__dirname}/migrations/{.ts,*.js}`],
        migrationsRun: false,
      }),
    }),
    UserModule,
    AuthModule,
    CategoriesModule,
    RecipesModule,
  ],
  controllers: [],
  providers: [
    MigrationService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private migrationService: MigrationService) {}

  async onModuleInit() {
    await this.migrationService.onModuleInit();
  }
}
