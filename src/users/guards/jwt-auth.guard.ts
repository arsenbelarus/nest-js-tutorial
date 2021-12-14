import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { User, UserRoleName } from '../entities/user.entity';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private reflector: Reflector, private authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const token = this.extractToken(request);

    if (!token) return false;

    request.payload = await this.authService.decodeUserToken(token);

    if (!request.payload) return false;

    // getting the required roles for the specific action
    const requiredRoles: UserRoleName[] = this.reflector.getAllAndOverride(
      ROLES_KEY,
      [context.getClass(), context.getHandler()],
    );

    if (!requiredRoles) return true;

    // getting current logged in user roles
    const currentUserRoles: UserRoleName[] = request.payload.user.roles.map(
      (role) => role.name,
    );

    return !!requiredRoles.some((role) => currentUserRoles.includes(role));
  }

  extractToken(request: Request) {
    const token: string = request.headers['authorization'];

    return token ? token.replace('Bearer ', '') : '';
  }
}
