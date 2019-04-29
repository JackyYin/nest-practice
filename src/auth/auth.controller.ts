import { Controller, Get, Post, Req, Response, Body, UsePipes, ValidationPipe, UseFilters } from '@nestjs/common';
import * as passport from 'passport';
import { SignupDto } from './dto/signup.dto';
import { BadRequestExceptionFilter } from '../common/filter/bad-request-exception.filter';

@Controller('auth')
export class AuthController {
    constructor() { }

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
    }
}
