import { Controller, Get, HttpCode } from '@nestjs/common';

@Controller('/')
export class helloPage {
  constructor() {}

  @Get()
  @HttpCode(200)
  async sayHello() {
    return 'hello';
  }
}
