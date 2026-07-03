import { Module } from '@nestjs/common';
import { HealthService } from './health.service';
import { HealthController } from './health.controller';
import { PrismaService } from '@/prisma/prisma.service';
import { RedisService } from '@/redis/redis.service';

@Module({
  providers: [HealthService, PrismaService, RedisService],
  controllers: [HealthController],
})
export class HealthModule {}
