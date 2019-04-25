import { Controller, Get, Req, Response } from '@nestjs/common';
import * as passport from 'passport';

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
      console.log(req.session.passport);
      res.render('auth/profile.ejs', { 'user': req.session.passport.user });
    }

    @Get('error')
    async getErrorView() {

    }

    @Get('login')
    async getLoginView(@Response() res) {
      res.render('login.ejs');
    }

    @Get('logout')
    async logout(@Req() req, @Response() res) {
      req.session.destroy();

      res.redirect('/auth/login');
    }
}

