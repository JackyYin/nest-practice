import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '../config/config.service';

@Injectable()
export class MailerService {
  private readonly transporter;

  constructor(private readonly config : ConfigService ) {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: config.get('SMTP_USER'),
        pass: config.get('SMTP_PASSWORD')
      }
    });
  }

  public sendMail(options) : Promise<any> {
    return new Promise((resolve, reject) => {
      this.transporter.sendMail((options), (err, res) => {
        if (err) reject(err);
        resolve(res);
      });
    });
  }
}
