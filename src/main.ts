import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  // app.setGlobalPrefix('public');

  // app.use((req, res, next) => {
  //   res.header('Access-Control-Allow-Origin', '*');
  //   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  //   res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
  //   next();
  // });

  // app.enableCors({
  //   allowedHeaders: '*',
  //   origin: '*',
  // });

  // app.enableCors({
  //   origin: 'http://localhost:3001',

  //   credentials: true,
  //   // all headers that client are allowed to use
  //   allowedHeaders: [
  //     'Accept',
  //     'Observe',
  //     'Authorization',
  //     'Content-Type',
  //     'X-Requested-With',
  //     'X-HTTP-Method-Override',
  //     'apollo-require-preflight',
  //   ],

  //   methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS', 'UPDATE'],
  // });

  app.useGlobalPipes(new ValidationPipe());
  // app.useStaticAssets(join(process.cwd(), 'public'));
  const configSevice = app.get(ConfigService);
  // app.use(
  //   session({
  //     secret: 'session-token',
  //     resave: true,
  //     saveUninitialized: true,
  //   }),
  // );
  // app.use((req, res, next) => {
  //   req.sessionStore.all((error, sessions) => {
  //     console.log('session', sessions);
  //     next();
  //   });
  // });

  const port = configSevice.get('PORT');
  app.use(graphqlUploadExpress());
  await app.listen(port);
}
bootstrap();
