import { Controller, Get, Post, Req, Response, Body, UsePipes, ValidationPipe, UseFilters, Inject } from '@nestjs/common';
import * as passport from 'passport';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { BadRequestExceptionFilter } from '../common/filter/bad-request-exception.filter';

@Controller('auth')
export class AuthController {
  constructor(@Inject('USER_MODEL') private readonly userModel) {}

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
  @UseFilters(new BadRequestExceptionFilter('/auth/login'))
  async login(@Req() req, @Response() res, @Body() loginDto: LoginDto) {
    const targetUser = await this.userModel.findOne({ email: loginDto.email }).exec();

    if (targetUser.comparePassword(loginDto.password)) {
      req.session.passport = {
        user: targetUser
      };
      return res.redirect('/auth/user');
    }
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
  @UseFilters(new BadRequestExceptionFilter('/auth/signup'))
  async signup(@Req() req, @Response() res, @Body() signupDto: SignupDto) {
    if (signupDto.password !== signupDto.password_confirmation) {
      req.flash('error', 'Passwords do not match');
      return res.redirect('/auth/signup');
    }

    const dupUser = await this.userModel.findOne({ email: signupDto.email }).exec();

    if (dupUser) {
      req.flash('error', '此email已有人使用');
      return res.redirect('/auth/signup');
    }

    const createdUser = new this.userModel({
      email:signupDto.email,
      password: bcrypt.hashSync(signupDto.password, 10),
      profile: {
        name: signupDto.username
      }
    });
    const success = await createdUser.save();

    if (success) {
      req.flash('success', '帳號註冊成功');
      return res.redirect('/auth/signup');
    }
  }
}
