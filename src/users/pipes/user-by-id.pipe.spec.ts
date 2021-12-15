import { NotFoundException } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UserByIdPipe } from './user-by-id.pipe';

describe('UserByIdPipe', () => {
  let pipe: UserByIdPipe;
  let usersService: UsersService;
  const user = {id: 1, name: 'John'};

  beforeEach(() => {
    usersService = new UsersService();
    pipe = new UserByIdPipe(usersService);
    jest.spyOn(usersService, 'findOne').mockImplementation(async (id) => {
      return id === 1 ? user : null;
    })
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should return user by id', async () => {
    expect(await pipe.transform('1')).toMatchObject(user)
  });

  it('should throw NotFoundException', () => {
    return expect(pipe.transform('3')).rejects.toThrow(NotFoundException);
  });
});
