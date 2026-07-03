import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { RedisModule } from './redis/redis.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [HealthModule, RedisModule],
  providers: [PrismaService],
})
export class AppModule {}
