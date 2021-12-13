import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateUserDto,
  CreateUserResponse,
  UpdateUserDto,
  UpdateUserResponse,
  UsersErrorResponse,
} from '../dto/user.dto';
import { User } from '../entities/user.entity';
import { UsersService } from '../services/users.service';

@Controller('users')
@ApiTags('Users')
@ApiResponse({ status: 500, type: UsersErrorResponse, description: 'Some informative response'})
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiQuery({ name: 'query', required: false })
  async findAll(@Query('query') query: string): Promise<User[]> {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @ApiResponse({ status: 404, type: UsersErrorResponse })
  async findOne(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.findOne(+id);

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
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
