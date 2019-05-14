import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
}
