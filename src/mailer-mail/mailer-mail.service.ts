import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailerMailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMailer(
    tos: string[],
    subject: string,
    templateName: string,
    context: any = {},
  ): Promise<boolean> {
    await this.mailerService.sendMail({
      to: tos.join(', '),
      subject,
      template: `./${templateName}`,
      context,
    });
    return true;
  }
}
