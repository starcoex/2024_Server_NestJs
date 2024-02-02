import { Test, TestingModule } from '@nestjs/testing';
import { VerificationResolver } from './verification.resolver';

describe('VerificationResolver', () => {
  let resolver: VerificationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VerificationResolver],
    }).compile();

    resolver = module.get<VerificationResolver>(VerificationResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
