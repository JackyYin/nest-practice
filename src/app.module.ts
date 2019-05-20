import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { MailerModule } from './mailer/mailer.module';
import { LdapModule } from './ldap/ldap.module';

@Module({
  imports: [
    UsersModule,
    DatabaseModule,
    AuthModule,
    ConfigModule,
    MailerModule,
    LdapModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
