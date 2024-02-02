import { Module } from '@nestjs/common';
import { SocialProviderResolver } from './social-provider.resolver';
import { SocialProviderService } from './social-provider.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [SocialProviderResolver, SocialProviderService, PrismaService],
})
export class SocialProviderModule {}
