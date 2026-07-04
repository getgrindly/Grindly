import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';

// Define the exact structural interface expected by the compiler error
interface HealthCheckResult {
  status: string;
  database: string;
  redis: string;
  timestamp: string;
}

@Controller('api/health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  async check(): Promise<HealthCheckResult> {
    return this.healthService.check();
  }
}
