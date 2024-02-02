import { Test, TestingModule } from '@nestjs/testing';
import { SocialProviderResolver } from './social-provider.resolver';

describe('SocialProviderResolver', () => {
  let resolver: SocialProviderResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocialProviderResolver],
    }).compile();

    resolver = module.get<SocialProviderResolver>(SocialProviderResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
