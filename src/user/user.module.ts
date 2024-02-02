import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailerMailService } from 'src/mailer-mail/mailer-mail.service';

@Module({
  providers: [UserResolver, UserService, PrismaService, MailerMailService],
})
export class UserModule {}
