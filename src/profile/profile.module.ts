import { DynamicModule, Module } from '@nestjs/common';
import { ProfileResolver } from './profile.resolver';
import { ProfileService } from './profile.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { MailerMailService } from 'src/mailer-mail/mailer-mail.service';

@Module({
  imports: [],
  providers: [
    ProfileResolver,
    ProfileService,
    PrismaService,
    UserService,
    MailerMailService,
  ],
})
export class ProfileModule {}
