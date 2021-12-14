import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersController } from './controllers/users.controller';
import { AuthController } from './controllers/auth.controller';
import { UsersService } from './services/users.service';
import { AuthService } from './services/auth.service';
import { UsersAdminController } from './controllers/users-admin.controller';
import { ConfigModule, ConfigService } from '../config';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.JWT_SECRET,
        signOptions: {
          expiresIn: '4d',
        },
      }),
    }),
  ],
  controllers: [UsersController, UsersAdminController, AuthController],
  providers: [UsersService, AuthService],
  exports: [UsersService, AuthService],
})
export class UsersModule {}
