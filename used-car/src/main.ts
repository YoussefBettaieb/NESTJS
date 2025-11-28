import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieSession from 'cookie-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    cookieSession({
      keys: ['mysecretkey'],
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // makes sure no other attribute gets inserted
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
