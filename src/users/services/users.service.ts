import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import { UserRole, UserRoleName, User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = User.create(createUserDto);

    await User.save(user);

    return user;
  }

  async findBy(query: Partial<User>): Promise<User[]> {
    return User.find<User>(query);
  }

  async findAll(searchString?: string): Promise<User[]> {
    return User.find(); // TODO dodac search
  }

  async findOne(id: number): Promise<User | null> {
    return User.findOne(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    return User.update({ id }, updateUserDto).then((res) => res.raw);
  }

  async remove(id: number): Promise<boolean> {
    const user = await User.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await user.remove();

    return true;
  }

  async addRole(userId: number, roleName: UserRoleName): Promise<User> {
    const user = await User.findOne(userId);
    const [role] = await UserRole.find({ name: roleName });

    if(!role) {
      throw new NotFoundException(`Role ${roleName} not found`);
    }

    user.roles.push(role);

    await user.save();

    return user;
  }

  async removeRole(userId: number, roleName: UserRoleName): Promise<User> {
    const user = await User.findOne(userId);
    user.roles = user.roles.filter((role) => role.name !== roleName);
    await user.save();
    return user;
  }
}
