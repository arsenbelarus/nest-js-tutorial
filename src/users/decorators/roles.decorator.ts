import { SetMetadata } from '@nestjs/common';
import { UserRoleName } from '../entities/user.entity';

export const ROLES_KEY = 'roles';

export const Roles = (...args: UserRoleName[]) => SetMetadata(ROLES_KEY, args);
