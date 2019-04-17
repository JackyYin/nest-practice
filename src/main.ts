import * as session from 'express-session';
import * as redis from 'connect-redis';
import * as passport from 'passport';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const RedisStore = redis(session);
  const app = await NestFactory.create(AppModule);

  app.use(session({
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
