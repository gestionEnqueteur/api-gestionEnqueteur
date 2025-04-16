import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';
import { stringify } from 'querystring';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle("API Swagger")
    .setDescription("Documentation API Nest Enqueteur")
    .setVersion('1.0')
    .addTag("enqueteur")
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (
      controllerKey: string,
      methodeKey: string
    ) => methodeKey

  };

  const documentationFactory = () => SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, documentationFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
