import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  // Return hello string
  getHello(): string {
    return 'Hello World!';
  }
}
