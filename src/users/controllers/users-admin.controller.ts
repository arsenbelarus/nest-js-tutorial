import {
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Auth } from '../decorators/auth.decorator';
import { Payload } from '../decorators/payload.decorator';
import { Roles } from '../decorators/roles.decorator';
import {
  RemoveRoleDto,
  UpdateUserResponse,
  UsersErrorResponse,
} from '../dto/user.dto';
import { User, UserRoleName } from '../entities/user.entity';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UserByIdPipe } from '../pipes/user-by-id.pipe';
import { UsersService } from '../services/users.service';

@Controller('users-admin')
@ApiTags('Adding and Removing Roles')
@ApiResponse({
  status: 500,
  type: UsersErrorResponse,
  description: 'Some informative response',
})
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Roles(UserRoleName.ADMIN)
@UseInterceptors(ClassSerializerInterceptor)
export class UsersAdminController {
  constructor(private usersService: UsersService) {}

  //add role to user
  @Post('user/:userId/role/:roleName')
  @ApiParam({ name: 'roleName', enum: UserRoleName })
  @ApiParam({ name: 'userId', type: Number })
  async addRoleToUser(
    @Param('userId', UserByIdPipe) user: User,
    @Param('roleName') roleName: UserRoleName,
  ): Promise<User> {
    return this.usersService.addRole(user.id, roleName);
  }

  //remove role from user
  //TODO RemoveRoleDto
  @ApiParam({ name: 'roleName', enum: UserRoleName })
  @ApiParam({ name: 'userId', type: Number })
  @Delete('user/:userId/role/:roleName')
  async deleteRoleFromUser(
    @Param() params: RemoveRoleDto,
  ): Promise<UpdateUserResponse> {
    const { userId, roleName } = params;
    const updatedUser = await this.usersService.removeRole(+userId, roleName);
    return { user: updatedUser };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  getMe(@Auth() loggedInUser: User, @Payload('token') token: string) {
    return loggedInUser;
  }
}
