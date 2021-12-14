import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UsersService } from '../services/users.service';

@Injectable()
export class UserByIdPipe implements PipeTransform {
  constructor(private usersService: UsersService) {}
  async transform(value: string, metadata: ArgumentMetadata): Promise<User> {
    const id = parseInt(value, 10);
    if (!id) {
      throw new BadRequestException('Id param has to be valid number');
    }
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`There is no user with id ${id}`);
    }
    return user;
  }
}
