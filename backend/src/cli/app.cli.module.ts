import { Module } from '@nestjs/common';
import { AppModule } from '../app.module';
import { SeedRecipesCommand } from './seed-recipes.command';

@Module({
  imports: [AppModule],
  providers: [SeedRecipesCommand],
})
export class AppCliModule {}

