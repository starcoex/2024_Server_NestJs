import { Module } from '@nestjs/common';
import { PaymentsResolver } from './payments.resolver';
import { PaymentsService } from './payments.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [PaymentsResolver, PaymentsService, PrismaService],
})
export class PaymentsModule {}
