import { User } from "../entities/user.entity";


export class CreateUserDto {
  name: string;
  email: string;
  password: string;
}

export class CreateUserResponse {
  user: User
}

export class UpdateUserDto {
  name: string;
  email: string;
}

export class UpdateUserResponse {
  user: User
}

export class UsersErrorResponse {
    statusCode: number;
    message: string;
    error: string;
}
