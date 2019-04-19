import { Injectable, Inject } from '@nestjs/common';
import * as passport from 'passport';
import { Strategy } from 'passport-facebook';
import { ConfigService } from '../../config/config.service';

@Injectable()
export class PassportFacebookService extends Strategy {
  constructor(
    @Inject('USER_MODEL') private readonly userModel,
    config: ConfigService
  ) {
    super({
      clientID: config.get('FB_ID'),
      clientSecret: config.get('FB_SECRET'),
      callbackURL: `${config.get('CALLBACK_URL')}/auth/facebook/callback`,
      passReqToCallback: true,
      profileFields: ['id', 'email', 'gender', 'link', 'name', 'photos'],
    }, (req, accessToken, tokenSecret, profile, done) => {
      console.log(accessToken);
      console.log(profile);
      userModel.findOne({ facebook: profile.id }, (err, existingUser) => {
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
            user.facebook = profile.id;
            user.profile.name = `${profile.name.givenName} ${profile.name.familyName}`;
            user.profile.gender = profile.gender;
            user.profile.picture = profile.photos[0].value;
            user.save((err) => {
              done(err, user);
            });
          }
        })
      });
    });

    passport.use(this);
  }
}
