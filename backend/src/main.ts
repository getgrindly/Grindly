import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const port = process.env.PORT || 5000;
  const origin = process.env.FRONTEND_URL || 'http://localhost:3000';

  app.enableCors({
    origin,
    credentials: true,
  });

  await app.listen(port, '0.0.0.0');
  console.log(`Server is running at http://localhost:${port}`);
}

bootstrap().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
