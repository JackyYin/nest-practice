import { Injectable, Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_MODEL') private readonly userModel
  ) {}

  async getVerifiedUserByPRT(passwordRestToken: string): Promise<any> {
    const users = await this.userModel.find({ passwordResetExpires: { $gt: Date.now() }}).exec();

    return users.find((user) => bcrypt.compareSync(passwordRestToken, user.passwordResetToken));
  }
}
