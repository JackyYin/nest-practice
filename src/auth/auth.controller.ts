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

    @Get('user')
    async getUserView(@Req() req, @Response() res) {
      console.log(req.session.passport);
      res.render('index.ejs', { 'user': req.session.passport.user });
    }

    @Get('error')
    async getErrorView() {

    }
}

