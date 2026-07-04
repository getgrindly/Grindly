import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { Cacheable } from ..@/redis/cache.decorator';

@Injectable()
export class HealthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  @Cacheable(30) // Cache for 30 seconds
  async check() {
    let databaseConnected = false;

    try {
      await this.prisma.$queryRaw`SELECT 1`;
      databaseConnected = true;
    } catch (error) {
      databaseConnected = false;
    }

    return {
      status: databaseConnected ? 'ok' : 'error',
      database: databaseConnected ? 'connected' : 'disconnected',
      redis: this.redisService.isConnected() ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
    };
  }
}
