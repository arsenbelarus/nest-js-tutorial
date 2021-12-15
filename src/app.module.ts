import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from './config/config.module';
import { PhotosModule } from './photos/photos.module';

@Module({
  imports: [UsersModule, ConfigModule, PhotosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
