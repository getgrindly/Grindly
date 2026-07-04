import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      // TypeScript now natively recognizes $connect()
      await this.$connect();
      this.logger.log('Successfully connected to the database.');
    } catch (error) {
      this.logger.error('Failed to connect to the database:', error);
      process.exit(1);
    }
  }

  async onModuleDestroy() {
    try {
      // TypeScript now natively recognizes $disconnect()
      await this.$disconnect();
      this.logger.log('Successfully disconnected from the database.');
    } catch (error) {
      this.logger.error('Error during database disconnection:', error);
    }
  }
}

