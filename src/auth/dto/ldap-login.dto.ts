import { IsNotEmpty } from 'class-validator';

export class LdapLoginDto {
  @IsNotEmpty()
  readonly username: string;
  @IsNotEmpty()
  readonly password: string;
}
