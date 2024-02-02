import { Test, TestingModule } from '@nestjs/testing';
import { SocialProviderService } from './social-provider.service';

describe('SocialProviderService', () => {
  let service: SocialProviderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocialProviderService],
    }).compile();

    service = module.get<SocialProviderService>(SocialProviderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
