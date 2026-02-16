import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'hagerehiwotlabs-backend',
    };
  }

  @Get('liveness')
  liveness() {
    return { status: 'UP' };
  }

  @Get('readiness')
  readiness() {
    return { status: 'UP' };
  }
}
