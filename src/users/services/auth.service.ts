import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, TokenPayload, RequestPayload } from '../entities/user.entity';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const [user] = await this.usersService.findBy({ email });
    if (!user) return null;
    if (!(await this.validatePassword(password, user.password))) return null;
    return user;
  }

  async encodePassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async validatePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async encodeUserToken(user: User): Promise<string> {
    const payload: TokenPayload = { username: user.email, sub: user.id };

    return this.jwtService.sign(payload);
  }

  async decodeUserToken(token: string): Promise<RequestPayload> {
    const payload: TokenPayload = this.jwtService.verify(token);
    const user = await this.usersService.findOne(payload.sub);

    return user ? { user, token } : null;
  }
}
