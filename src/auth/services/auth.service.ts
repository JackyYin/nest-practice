import { Injectable, Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { MailerService } from '../../mailer/mailer.service';
import { LdapLoginDto } from '../dto/ldap-login.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_MODEL') private readonly userModel,
    @Inject('LDAP_CLIENT') private readonly ldapClient,
    private readonly mailerService: MailerService
  ) {}

  async getVerifiedUserByPRT(passwordRestToken: string): Promise<any> {
    const users = await this.userModel.find({ passwordResetExpires: { $gt: Date.now() }}).exec();

    return users.find((user) => bcrypt.compareSync(passwordRestToken, user.passwordResetToken));
  }

  async sendResetPasswordMail(host, token, email) : Promise<void> {
    this.mailerService.sendMail({
      from: 'jackyyin@starlux-airlines.com',
      to: email,
      subject: 'Reset your password on Nestjs',
      text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
              Please click on the following link, or paste this into your browser to complete the process:\n\n
              http://${host}/auth/reset/${token}\n\n
              If you did not request this, please ignore this email and your password will remain unchanged.\n`
    });
    return;
  }

  async sendPasswordChangedMail(email) : Promise<void> {
    this.mailerService.sendMail({
      from: 'jackyyin@starlux-airlines.com',
      to: email,
      subject: 'Your Nestjs password has been changed',
      text: `Hello,\n\nThis is a confirmation that the password for your account ${email} has just been changed.\n`
    });
    return;
  }

  getLdapUser(ldapLoginDto : LdapLoginDto) : Promise<any> {
    const opts = {
      filter: `(&(objectCategory=user)(objectClass=user)(sAMAccountName=${ldapLoginDto.username}))`,
      scope: 'sub'
    }

    return new Promise((resolve, reject) => {
      this.ldapClient.bind(`${ldapLoginDto.username}@starlux-airlines.com`, ldapLoginDto.password, (err) => {
        this.ldapClient.search('OU=starlux-airlines,DC=starlux-airlines,DC=com', opts, (err, result) => {
          result.on('searchEntry', (entry) => {
            resolve(entry.object);
          });

          result.on('error', error => {
            reject(error.message);
          })

          result.on('end', result => {
            console.log('If not found', result);
          })
        })
      })
    });
  }
}
