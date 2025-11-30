import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppConfigService } from './app-config/app-config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(AppConfigService);

  // CORS is handled by nginx in production
  // Only enable in development when running without nginx
  if (configService.nodeEnv === 'development' && !process.env.DISABLE_NEST_CORS) {
    const allowedOrigins =
      configService.corsOrigins.length > 0
        ? configService.corsOrigins
        : '*';

    app.enableCors({
      origin: allowedOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });
  }
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
    }),
  );

    // app.enableCors(); // Enables CORS with default settings


  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Receitas Culinarias API')
    .setDescription('API para gerenciamento de receitas culinarias')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(configService.appPort || 3000);
}
bootstrap();
