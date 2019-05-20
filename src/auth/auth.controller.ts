import { Controller, Get, Post, Req, Response, Body, UsePipes, ValidationPipe, UseFilters, Inject, Session } from '@nestjs/common';
import * as passport from 'passport';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Model } from 'mongoose';
import { AuthService } from './services/auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotDto } from './dto/forgot.dto';
import { ResetDto } from './dto/reset.dto';
import { LdapLoginDto } from './dto/ldap-login.dto';
import { BadRequestExceptionFilter } from '../common/filter/bad-request-exception.filter';
import { PasswordCompareValidationPipe } from './password-compare-validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('USER_MODEL') private readonly userModel,
    @Inject('LDAP_CLIENT') private readonly ldap,
    private readonly authService: AuthService
  ) {}

  @Get('google')
  async googleSignIn() {

  }

  @Get('google/callback')
  async googleCallback() {

  }

  @Get('facebook')
  async facebookSignIn() {

  }

  @Get('facebook/callback')
  async facebookCallback() {

  }

  @Get('github')
  async githubSignIn() {

  }

  @Get('github/callback')
  async githubCallback() {

  }

  @Get('user')
  async getUserView(@Req() req, @Response() res) {
    if (!req.session.passport) {
      res.redirect('/auth/login');
    }
    console.log(req.user);
    res.render('auth/profile.ejs', { 'user': req.user });
  }

  @Get('error')
  async getErrorView() {

  }

  @Get('login')
  async getLoginView(@Response() res) {
    res.render('auth/login.ejs');
  }

  @Post('login')
  @UsePipes(ValidationPipe)
  @UseFilters(new BadRequestExceptionFilter())
  async login(@Req() req, @Response() res, @Body() loginDto: LoginDto) {
    const targetUser = await this.userModel.findOne({ email: loginDto.email }).exec();

    if (await targetUser.comparePassword(loginDto.password)) {
      req.session.passport = {
        user: targetUser
      };
      return res.redirect('/auth/user');
    } else {
      req.flash('error', '帳號或密碼錯誤');
      return res.redirect('/auth/login');
    }
  }

  @Get('ldap/login')
  async getLdapLoginView(@Response() res, @Session() session) {
    console.log(session);
    res.render('auth/ldap-login.ejs');
  }

  @Post('ldap/login')
  @UsePipes(ValidationPipe)
  @UseFilters(new BadRequestExceptionFilter())
  async ldapLogin(@Req() req, @Response() res, @Body() ldapLoginDto: LdapLoginDto, @Session() session) {
    const opts = {
      filter: `(&(objectCategory=user)(objectClass=user)(sAMAccountName=${ldapLoginDto.username}))`,
      scope: 'sub'
    }

    this.ldap.bind(`${ldapLoginDto.username}@starlux-airlines.com`, ldapLoginDto.password, (err) => {
      this.ldap.search('OU=starlux-airlines,DC=starlux-airlines,DC=com', opts, (err, result) => {
        result.on('searchEntry', async (entry) => {
          console.log(entry.object);

          let user = await this.userModel.findOne({email: entry.object.mail }).exec();

          if (!user) {
            user = await this.userModel.create({
              email: entry.object.mail,
              profile: {
                name: entry.object.name
              }
            });
          }

          req.logout();
          session.passport = { user: user };

          return res.redirect('/auth/user');
        });

        result.on('error', error => {
          console.error('error: ', error.message);
          req.flash('error', 'Ldap Authentication Failed!');
          res.redirect('back');
        })

        result.on('end', result => {
          console.log('If not found', result);
        })
      })
    })
  }

  @Get('logout')
  async logout(@Req() req, @Response() res) {
    req.session.destroy();
    req.logout();
    res.redirect('/auth/login');
  }

  @Get('signup')
  async getSignupView(@Req() req, @Response() res) {
    res.render('auth/signup.ejs');
  }

  @Post('signup')
  @UsePipes(ValidationPipe)
  @UsePipes(PasswordCompareValidationPipe)
  @UseFilters(new BadRequestExceptionFilter())
  async signup(@Req() req, @Response() res, @Body() signupDto: SignupDto) {
    const dupUser = await this.userModel.findOne({ email: signupDto.email }).exec();

    if (dupUser) {
      req.flash('error', '此email已有人使用');
      return res.redirect('/auth/signup');
    }

    const createdUser = new this.userModel({
      email:signupDto.email,
      password: await bcrypt.hash(signupDto.password, 10),
      profile: {
        name: signupDto.username
      }
    });
    const success = await createdUser.save();

    if (success) {
      req.session.passport = {
        user: createdUser
      };
      return res.redirect('/auth/user');
    }
  }

  @Get('forgot')
  async getForgotView(@Req() req, @Response() res) {
    if (req.isAuthenticated()) {
      return res.redirect('/auth/user');
    }

    res.render('auth/forgot.ejs');
  }

  @Post('forgot')
  @UsePipes(ValidationPipe)
  @UseFilters(new BadRequestExceptionFilter())
  async forgot(@Req() req, @Response() res, @Body() forgotDto: ForgotDto) {
    let user = await this.userModel.findOne({ email: forgotDto.email }).exec();

    if (!user) {
      req.flash('error', '不存在的email');
      return res.redirect('/auth/forgot');
    }

    if (user.facebook || user.github || user.google) {
      req.flash('error', '社群帳號請使用社群登入');
      return res.redirect('/auth/login');
    }

    const token = crypto.randomBytes(256).toString('hex');

    user.passwordResetToken = await bcrypt.hash(token, 10);
    user.passwordResetExpires = Date.now() + 3600000
    user = await user.save();

    this.authService.sendResetPasswordMail(req.headers.host, token, user.email);

    req.flash('info', `An e-mail has been sent to ${user.email} with further instructions.`);
    return res.redirect('/auth/forgot');
  }

  @Get('/reset/:token')
  async getRestView(@Req() req, @Response() res) {
    if (req.isAuthenticated()) {
      return res.redirect('/auth/user');
    }

    const user = await this.authService.getVerifiedUserByPRT(req.params.token);

    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/auth/forgot');
    }

    res.render('auth/reset.ejs', { 'user': user});
  }

  @Post('/reset/:token')
  @UsePipes(ValidationPipe)
  @UsePipes(PasswordCompareValidationPipe)
  @UseFilters(new BadRequestExceptionFilter())
  async reset(@Req() req, @Response() res, @Body() resetDto: ResetDto) {
    let user = await this.authService.getVerifiedUserByPRT(req.params.token);

    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/auth/forgot');
    }

    user.password = await bcrypt.hash(resetDto.password, 10);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    this.authService.sendPasswordChangedMail(user.email);

    req.flash('success', 'Success! Your password has been changed.');
    res.redirect('/auth/login');
  }
}
