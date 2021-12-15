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
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileUploadDto } from '../dto/photos.dto';
import { PhotosService } from '../services/photos.service';
import { join } from 'path';
import { ConfigService } from '../../config';
import { stat } from 'fs/promises';

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

    const stats = await stat(file).catch((e) => {
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
  async upload(@UploadedFile() file: Express.Multer.File, @Body() body) {
    const photo = await this.photosService.create(file);
    const avatar = await this.photosService.createThumb(photo.filename);

    return { file, body, photo, avatar };
  }
}
