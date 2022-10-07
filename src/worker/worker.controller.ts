import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller('worker')
export class WorkerController {
  @MessagePattern('sum')
  accumulate(data: number[]) {
    return data.reduce((a, b) => a + b);
  }
}
