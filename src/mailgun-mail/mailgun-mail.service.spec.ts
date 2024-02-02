import { Test, TestingModule } from '@nestjs/testing';
import { MailgunMailService } from './mailgun-mail.service';

describe('MailgunMailService', () => {
  let service: MailgunMailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailgunMailService],
    }).compile();

    service = module.get<MailgunMailService>(MailgunMailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
