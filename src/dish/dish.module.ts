import { Module } from '@nestjs/common';
import { DishResolver } from './dish.resolver';
import { DishService } from './dish.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [DishResolver, DishService, PrismaService],
})
export class DishModule {}
