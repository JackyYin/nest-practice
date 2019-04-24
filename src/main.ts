import * as session from 'express-session';
import * as path from 'path';
import * as redis from 'connect-redis';
import * as passport from 'passport';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const RedisStore = redis(session);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setViewEngine('ejs');
  app.setBaseViewsDir([path.join(__dirname, "views")]);
  app.useStaticAssets(path.join(__dirname, '../public'));

  app.use(session({
    resave: false,
    saveUninitialized: false,
    store: new RedisStore({
      host: 'redis',
      port: 6379
    }),
    secret: 'blablabla'
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(3000);
}
bootstrap();
