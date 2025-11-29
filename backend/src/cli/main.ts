import { CommandFactory } from 'nest-commander';
import { AppCliModule } from './app.cli.module';

async function bootstrap() {
  await CommandFactory.run(AppCliModule, {
    logger: ['log', 'error', 'warn'],
  });
}

bootstrap();

