import { Controller, Get, Param } from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
@ApiTags('Test')
export class AppController {
  @Client({ transport: Transport.TCP, options: { port: 3001 } })
  client: ClientProxy;

  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('contact')
  contact(): string {
    return 'Hello contact';
  }

  @Get('sum/:numbers')
  sum(@Param('numbers') data: string) {
    const numbers = data.split(',').map((v) => +v);

    return this.client.send('sum', numbers);
  }
}
