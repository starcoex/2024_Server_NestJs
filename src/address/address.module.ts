import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressResolver } from './address.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { MailerMailService } from 'src/mailer-mail/mailer-mail.service';

@Module({
  providers: [
    AddressService,
    AddressResolver,
    PrismaService,
    UserService,
    MailerMailService,
  ],
})
export class AddressModule {}
