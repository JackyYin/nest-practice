import {
    Module, NestModule,
    MiddlewareConsumer,
    RequestMethod,
} from '@nestjs/common';
import * as passport from 'passport';
import { AuthController } from './auth.controller';
import { PassportGoogleService } from './services/passportGoogle.service';
import { PassportFacebookService } from './services/passportFacebook.service';
import { UsersModule } from '../users/users.module';

@Module({
	imports: [UsersModule],
	providers: [PassportGoogleService, PassportFacebookService],
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
      .apply(passport.authenticate('facebook', {
        scope: ['email', 'user_photos', 'user_gender', 'user_link']
      }))
      .forRoutes({ path: '/auth/facebook', method: RequestMethod.GET })
      .apply(passport.authenticate('facebook', {
        successRedirect: '/auth/user',
        failureRedirect: '/auth/error'
      }))
      .forRoutes({ path: '/auth/facebook/callback', method: RequestMethod.GET })
  }
}
