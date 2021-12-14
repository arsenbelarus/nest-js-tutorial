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
import {
  CreateUserDto,
  CreateUserResponse,
  UpdateUserDto,
  UpdateUserResponse,
  UsersErrorResponse,
} from '../dto/user.dto';
import { User } from '../entities/user.entity';
import { UserExceptionFilter } from '../filters/user-exception.filter';
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
