import { IsNotEmpty, MinLength } from 'class-validator';

export class ResetDto {
  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;
  @IsNotEmpty()
  readonly password_confirmation: string;
}
