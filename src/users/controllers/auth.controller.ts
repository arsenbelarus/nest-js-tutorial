import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  AuthLoginDto,
  AuthLoginResponse,
  AuthRegisterDto,
  AuthRegisterResponse,
} from '../dto/auth.dto';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';

@Controller('auth')
@ApiTags('Auth')
@UsePipes(ValidationPipe)
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('register')
  async register(
    @Body(new ValidationPipe({ transform: true })) data: AuthRegisterDto,
  ): Promise<AuthRegisterResponse> {
    const user = await this.usersService.create({
      ...data,
      password: await this.authService.encodePassword(data.password),
    });

    return { user };
  }

  @Post('login')
  async login(@Body() data: AuthLoginDto): Promise<AuthLoginResponse> {
    const user = await this.authService.validateUser(data.email, data.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.authService.encodeUserToken(user);

    return { user, token };
  }
}
