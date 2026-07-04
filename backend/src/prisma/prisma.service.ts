import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  
  public readonly client = new PrismaClient();

  async onModuleInit() {
    try {
      await this.client.$connect();
      this.logger.log('Successfully connected to the database.');
    } catch (error) {
      this.logger.error('Failed to connect to the database:', error);
      process.exit(1);
    }
  }

  async onModuleDestroy() {
    try {
      await this.client.$disconnect();
      this.logger.log('Successfully disconnected from the database.');
    } catch (error) {
      this.logger.error('Error during database disconnection:', error);
    }
  }
}
