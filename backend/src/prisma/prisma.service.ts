import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '../generated/client';

@Injectable()
export class PrismaService extends (PrismaClient as any) implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      // Using array syntax/runtime access prevents TS compile errors
      await (this as any).$connect();
      this.logger.log('Successfully connected to the database.');
    } catch (error) {
      this.logger.error('Failed to connect to the database:', error);
      process.exit(1);
    }
  }

  async onModuleDestroy() {
    try {
      await (this as any).$disconnect();
      this.logger.log('Successfully disconnected from the database.');
    } catch (error) {
      this.logger.error('Error during database disconnection:', error);
    }
  }
}
