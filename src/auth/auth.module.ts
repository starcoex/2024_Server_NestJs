import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailerMailService } from 'src/mailer-mail/mailer-mail.service';

@Module({
  imports: [],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    UserService,
    PrismaService,
    MailerMailService,
  ],
})
export class AuthModule {}
