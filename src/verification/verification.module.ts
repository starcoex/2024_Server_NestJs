import { Module } from '@nestjs/common';
import { VerificationResolver } from './verification.resolver';
import { VerificationService } from './verification.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [VerificationResolver, VerificationService, PrismaService],
})
export class VerificationModule {}
