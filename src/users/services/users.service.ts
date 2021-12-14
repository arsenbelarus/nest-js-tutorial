import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import { UserRole, UserRoleName, User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  private UserRoleName: UserRole[] = [
    new UserRole({ id: 1, name: UserRoleName.MANAGER }),
    new UserRole({ id: 2, name: UserRoleName.SALES }),
    new UserRole({ id: 3, name: UserRoleName.USER }),
    new UserRole({ id: 4, name: UserRoleName.ADMIN }),
  ];

  private users: User[] = [
    new User({
      id: 1,
      name: 'Tigran',
      email: 'tigran@myflow.pl',
      password: '123',
      roles: [this.UserRoleName[0]],
    }),
    new User({
      id: 2,
      name: 'Dawid',
      email: 'dawid@myflow.pl',
      password: '$2b$10$PoZOZcXnn.QTAZNFIb4clusTUChpWh6jH8OgAbJKwKfMbcopMpuF6',
      roles: [this.UserRoleName[3]],
    }),
  ];

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User({
      ...createUserDto,
      id: this.users.length + 1,
    });

    this.users.push(user);

    return user;
  }

  async findBy(query: Partial<User>): Promise<User[]> {
    return [
      ...this.users.filter((user) => user.email === query.email),
      ...this.users.filter((user) => user.id === query.id),
    ];
  }

  async findAll(searchString?: string): Promise<User[]> {
    let users = this.users;
    if (searchString) {
      const queryReg = new RegExp(searchString, 'i');
      const findFn = (row) =>
        row.name.search(queryReg) >= 0 || row.email.search(queryReg) >= 0;
      users = this.users.filter(findFn);
    }

    return users;
  }

  async findOne(id: number): Promise<User | null> {
    return this.users.find((q) => q.id === id);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    for (let i = 0; i < this.users.length; i++) {
      const user = this.users[i];
      if (user.id === id) {
        this.users[i] = new User({
          ...user,
          ...updateUserDto,
          id,
        });
        return this.users[i];
      }
    }
    return null;
  }

  async remove(id: number): Promise<boolean> {
    this.users = this.users.filter((user) => user.id !== id);
    return true;
  }

  async addRole(userId: number, roleName: UserRoleName): Promise<User> {
    const user = await this.findOne(userId);
    const newRole = this.UserRoleName.find((role) => role.name === roleName);
    user.roles.push(newRole);
    return user;
  }

  async removeRole(userId: number, roleName: UserRoleName): Promise<User> {
    const user = await this.findOne(userId);
    user.roles = user.roles.filter((role) => role.name !== roleName);
    return user;
  }
}
