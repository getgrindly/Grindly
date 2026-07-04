import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from '../backend/src/app.module'
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
  const origin = process.env.FRONTEND_URL || 'http://localhost:3000';

  app.enableCors({
    origin,
    credentials: true,
  });

  await app.listen(port, '0.0.0.0');
  console.log(`Server is running on http://localhost:${port}`);
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
