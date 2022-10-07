import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Render,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileUploadDto } from '../dto/photos.dto';
import { PhotosService } from '../services/photos.service';
import { join } from 'path';
import { ConfigService } from '../../config';
import { stat } from 'fs/promises';
import { User } from '../../users/entities/user.entity';
import { Auth } from '../../users/decorators/auth.decorator';
import { JwtAuthGuard } from '../../users/guards/jwt-auth.guard';

@Controller('photos')
@ApiTags('Photos')
export class PhotosController {
  constructor(
    private photosService: PhotosService,
    private config: ConfigService,
  ) {}

  @Get()
  @Render('photos/index')
  async index() {
    const photos = await this.photosService.getUserPhotos();
    return { photos };
  }

  @Get('download/:filename')
  async download(
    @Param('filename') filename: string,
    @Res() response: Response,
  ) {
    const file = join(this.config.STORAGE_PHOTOS, filename);

    await stat(file).catch((e) => {
      throw new NotFoundException(`File ${filename} not found`);
    });

    response.download(file, filename, (err) => {

      if (err) {
        //handle error
      } else {
        //handle success
      }
    });
  }

  @Post('uploads')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDto })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async upload(@UploadedFile() file: Express.Multer.File, @Body() body, @Auth() user: User) {
    const photo = await this.photosService.create(file, user);
    const avatar = await this.photosService.createThumb(photo.filename);

    return { file, body, photo, avatar };
  }
}
