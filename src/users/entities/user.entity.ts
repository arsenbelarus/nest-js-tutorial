import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum UserRoleName {
  ADMIN = 'admin',
  SALES = 'sales',
  USER = 'user',
  MANAGER = 'manager',
}

@Entity()
export class UserRole extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: UserRoleName;

  @ManyToMany((type) => User)
  users: User[];
}

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password?: string;

  @ManyToMany((type) => UserRole, (role) => role.users, { eager: true })
  @JoinTable()
  roles?: UserRole[];
}

export class TokenPayload {
  username: string;
  sub: number;
}

export class RequestPayload {
  user: User;
  token: string;
}
