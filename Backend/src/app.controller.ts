import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  // Service injection
  // eslint-disable-next-line no-unused-vars
  constructor(private readonly appService: AppService) {}

  // GET /: Returns hello string
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
