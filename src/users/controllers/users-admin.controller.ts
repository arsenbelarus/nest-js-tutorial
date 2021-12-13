import { Controller, Delete, Param, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserResponse, UsersErrorResponse } from '../dto/user.dto';
import { UserRoleName } from '../entities/user.entity';
import { UsersService } from '../services/users.service';

@Controller('users-admin')
@ApiTags('Adding and Removing Roles')
@ApiResponse({
  status: 500,
  type: UsersErrorResponse,
  description: 'Some informative response',
})
export class UsersAdminController {
  constructor(private usersService: UsersService) {}

  @Post('user/:id/role/:roleName')
  async addRoleToUser(
    @Param('id') id: string,
    @Param('roleName') roleName: UserRoleName,
  ): Promise<UpdateUserResponse> {
    const user = await this.usersService.addRole(+id, roleName);
    return { user };
  }

  @Delete('user/:id/role/:roleName')
  async deleteRoleFromUser(
    @Param('id') id: string,
    @Param('roleName') roleName: UserRoleName,
  ): Promise<UpdateUserResponse> {
    const user = await this.usersService.removeRole(+id, roleName);
    return { user };
  }
}
