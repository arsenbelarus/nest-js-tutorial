import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { User } from '../entities/user.entity';

export class AuthLoginDto {
  @ApiProperty({ example: 'dawid@myflow.pl' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123' })
  @IsString()
  @MinLength(3)
  password: string;
}

export class AuthLoginResponse {
  token: string;
  user: User;
}

export class AuthRegisterDto {
  @ApiProperty({ example: 'Arsen' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'dawid@myflow.pl' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123' })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  password: string;
}

export class AuthRegisterResponse {
  user: User;
}
