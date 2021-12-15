import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map, tap, fromEvent, takeUntil, startWith } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const [request, response, nex]: [Request, any, any] = context.getArgs();
    //TODO mutate request

    console.time('Request duration');

    // request.on('close', () => {
    //   console.log('Request Cancelled');
    // });

    const close$ = fromEvent(request, 'close');

    return next.handle().pipe(
      // TODO mutate response
      map((response) => response),
      tap((res) => console.timeEnd('Request duration')),
      takeUntil(close$),
      startWith('')
    );
  }
}
