import { Module, Global } from '@nestjs/common';
import { ldapProviders } from './ldap.providers';

@Global()
@Module({
  providers: [...ldapProviders],
  exports: [...ldapProviders]
})
export class LdapModule {}
