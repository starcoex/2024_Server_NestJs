import { DynamicModule, Global, Module } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { MailgunModuleOptions } from './interfaces/mailgun-mail-module-option';
import { MailgunMailService } from './mailgun-mail.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({})
@Global()
export class MailgunMailModule {
  static forRoot(options: MailgunModuleOptions): DynamicModule {
    return {
      module: MailgunMailModule,
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
        MailgunMailService,
        PrismaService,
      ],
      exports: [MailgunMailService],
    };
  }
}
