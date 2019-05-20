import * as ldapjs from 'ldapjs';
import { ConfigService } from '../config/config.service';

export const ldapProviders = [
  {
    provide: 'LDAP_CLIENT',
    useFactory: (config: ConfigService) => {
      return ldapjs.createClient({
        url: config.get('LDAP_URL')
      })
    },
    inject: [ConfigService]
  },
];
