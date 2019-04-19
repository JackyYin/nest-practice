import { Injectable, Inject } from '@nestjs/common';
import * as passport from 'passport';
import { Strategy } from 'passport-github';
import { ConfigService } from '../../config/config.service';

@Injectable()
export class PassportGithubService extends Strategy {
  constructor(
    @Inject('USER_MODEL') private readonly userModel,
    config: ConfigService
  ) {
    super({
      clientID: config.get('GITHUB_ID'),
      clientSecret: config.get('GITHUB_SECRET'),
      callbackURL: `${config.get('CALLBACK_URL')}/auth/github/callback`,
      passReqToCallback: true,
    }, (req, accessToken, tokenSecret, profile, done) => {
      console.log(accessToken);
      console.log(profile);
      userModel.findOne({ github: profile.id }, (err, existingUser) => {
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
            user.github = profile.id;
            user.profile.name = profile.displayName;
            user.profile.picture = profile._json.avatar_url;
            user.profile.location = profile._json.location;
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
