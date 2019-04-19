import { Injectable, Inject } from '@nestjs/common';
import * as passport from 'passport';
import { OAuth2Strategy } from 'passport-google-oauth';
import { ConfigService } from '../../config/config.service';

@Injectable()
export class PassportGoogleService extends OAuth2Strategy {
  constructor(
    @Inject('USER_MODEL') private readonly userModel,
    config: ConfigService
  ) {
    super({
      clientID: config.get('GOOGLE_ID'),
      clientSecret: config.get('GOOGLE_SECRET'),
      callbackURL: `${config.get('CALLBACK_URL')}/auth/google/callback`,
      passReqToCallback: true
    }, (req, accessToken, refreshToken, profile, done) => {
      console.log(accessToken);
      console.log(profile);
      userModel.findOne({ google: profile.id }, (err, existingUser) => {
        if (err) { return done(err); }
        if (existingUser) {
          return done(null, existingUser);
        }
        userModel.findOne({ email: profile.emails[0].value }, (err, existingEmailUser) => {
          if (err) { return done(err); }
          if (existingEmailUser) {
            done(err);
          } else {
            const user = new userModel();
            user.email = profile.emails[0].value;
            user.google = profile.id;
            user.profile.name = profile.displayName;
            user.profile.gender = profile._json.gender;
            user.profile.picture = profile.photos[0].value;
            user.save((err) => {
              done(err, user);
            });
          }
        })
      });
    })

    passport.use(this);

    passport.serializeUser((user, done) => {
      done(null, user);
    });

    passport.deserializeUser((user, done) => {
      done(null, user);
    });
  }
}
