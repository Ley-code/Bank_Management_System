import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api'); // Set a global prefix for all routes
    app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // strips properties without decorators
    forbidNonWhitelisted: true, // throws error if extra properties are present
    transform: true,
  }));
  app.enableCors(); // Enable CORS for all routes
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
