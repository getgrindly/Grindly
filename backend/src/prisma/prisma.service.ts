import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '../generated/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      // Fully type-safe connection check
      await this.$connect();
      this.logger.log('Successfully connected to the database.');
    } catch (error) {
      this.logger.error('Failed to connect to the database:', error);
      process.exit(1);
    }
  }

  async onModuleDestroy() {
    try {
      // Fully type-safe disconnection check
      await this.$disconnect();
      this.logger.log('Successfully disconnected from the database.');
    } catch (error) {
      this.logger.error('Error during database disconnection:', error);
    }
  }
}
