import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import {
  EmailVar,
  MailgunModuleOptions,
} from './interfaces/mailgun-mail-module-option';
import got from 'got';
import * as FormData from 'form-data';
import { VerifyEmailOutput } from 'src/verification/dto/verity-email.dto';
import Mailgun, { MailgunMessageData } from 'mailgun.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailgunMailService {
  constructor(
    @Inject(CONFIG_OPTIONS)
    private readonly mailgunOptions: MailgunModuleOptions,
    private readonly configService: ConfigService,
  ) {}

  private async sendMailgunMail(
    to: string,
    subject: string,
    template: string,
    emailVars: EmailVar[],
  ) {
    try {
      const form = new FormData();
      form.append('from', `스타코엑스 <starcoex@$naver.com>`);
      form.append('to', to);
      form.append('subject', subject);
      form.append('template', template);
      emailVars.forEach((eVal) => form.append(`v:${eVal.key}`, eVal.value));
      const response = await got(
        `${this.mailgunOptions.url}${this.mailgunOptions.username}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${Buffer.from(
              `api:${this.mailgunOptions.key}`,
            ).toString('base64')}`,
          },
          body: form,
        },
      );
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  sendVerificationEmail(email: string, code: string) {
    this.sendMailgunMail(email, 'Verify Your Email', 'starcoex_account', [
      {
        key: 'code',
        value: code,
      },
      { key: 'username', value: email },
    ]);
  }

  async mailgun(
    to: string,
    code: string,
    username: string,
  ): Promise<VerifyEmailOutput> {
    try {
      const mailgun = new Mailgun(FormData);
      const mg = await mailgun.client({
        username: 'starocexe sgstaroc',
        key: this.configService.get('MAILGUN_KEY'),
      });
      const mailgunMessageData: MailgunMessageData = {
        from: '스타코엑스 <starcoex@naver.com>',
        to,
        subject: 'Verify Your Email',
        template: 'starcoex_account',
        'v:code': code,
        'v:username': username,
      };

      const mailgunSend = await mg.messages.create(
        this.configService.get('MAILGUN_DOMAIN_NAME'),
        mailgunMessageData,
      );
      console.log(mailgunSend);
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
    }
  }
}
