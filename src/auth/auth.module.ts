import {
    Module, NestModule,
    MiddlewareConsumer,
    RequestMethod,
} from '@nestjs/common';
import * as passport from 'passport';
import { AuthController } from './auth.controller';
import { PassportGoogleService } from './passportGoogle.service';
import { UsersModule } from '../users/users.module';

@Module({
	imports: [UsersModule],
	providers: [PassportGoogleService],
  controllers: [AuthController],
})
export class AuthModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(passport.authenticate('google', {
          scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']
      }))
      .forRoutes({ path: '/auth/google', method: RequestMethod.GET })
      .apply(passport.authenticate('google', {
          successRedirect: '/auth/user',
          failureRedirect: '/auth/error'
      }))
      .forRoutes({ path: '/auth/google/callback', method: RequestMethod.GET })
  }
}
