import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Observable, takeUntil, timer } from 'rxjs';
import {
  CreateUserDto,
  CreateUserResponse,
  UpdateUserDto,
  UpdateUserResponse,
  UsersErrorResponse,
} from '../dto/user.dto';
import { User } from '../entities/user.entity';
import { UserExceptionFilter } from '../filters/user-exception.filter';
import { PerformanceInterceptor } from '../interceptors/performance.interceptor';
import { UserByIdPipe } from '../pipes/user-by-id.pipe';
import { UsersService } from '../services/users.service';

@Controller('users')
@ApiTags('Users')
@ApiResponse({
  status: 500,
  type: UsersErrorResponse,
  description: 'Some informative response',
})
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(PerformanceInterceptor)
@UseFilters(UserExceptionFilter)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiQuery({ name: 'query', required: false })
  async findAll(@Query('query') query: string): Promise<User[]> {
    if (query === 'err') {
      throw new Error('Test Error');
    }
    return this.usersService.findAll(query);
  }

  @Get('search')
  @ApiQuery({ name: 'query', required: false })
  @ApiResponse({ status: 200, type: User, isArray: true })
  search(@Query('query') query: string): Observable<User[]> {
    return new Observable<User[]>((subscriber) => {
      // CONSTRUCTOR
      console.log('Constructor');
      const id = setTimeout(() => {
        console.log('Complete');
        subscriber.next([]);
        subscriber.complete();
      }, 10000);

      return () => {
        // DESTRUCTOR
        // TOTO close database connection / cancel sql query !!!
        console.log('Destructor');
        clearTimeout(id);
      };
    });
  }

  @Get(':id')
  @ApiResponse({ status: 404, type: UsersErrorResponse })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    const user = await this.usersService.findOne(id);

    if (!user) {
      throw new NotFoundException(`User with id: ${id} doesn't exist`);
    }

    return user;
  }

  @Post()
  async create(@Body() data: CreateUserDto): Promise<CreateUserResponse> {
    const user = await this.usersService.create(data);

    return { user };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateUserDto,
  ): Promise<UpdateUserResponse> {
    const user = await this.usersService.update(+id, data);
    return { user };
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id', UserByIdPipe) user: User) {
    return this.usersService.remove(user.id);
  }
}
