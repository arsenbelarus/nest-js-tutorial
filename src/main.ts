import { NestFactory } from '@nestjs/core';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerCustomOptions,
} from '@nestjs/swagger';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { expressApp } from './express/server';
import { ConfigService } from './config';
import { join } from 'path';

const expressAdapter = new ExpressAdapter(expressApp);

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    expressAdapter,
  );

  app.enableShutdownHooks();
  const config = app.get(ConfigService);
  app.useStaticAssets(config.STORAGE_ASSETS);
  app.setViewEngine('hbs');
  app.setBaseViewsDir(join(__dirname, 'views'));

  // SWAGGER SETUP
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Arsens project')
    .setDescription('Przykładowy projekt w Node.js i TypeScript')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  const document = SwaggerModule.createDocument(app, swaggerConfig, options);

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: { persistAuthorization: true },
  };

  SwaggerModule.setup('docs', app, document, customOptions);
  // END OF SWAGGER SETUP

  await app.listen(config.PORT);
}
bootstrap();
