import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/user/entities/user.entity';
import { CreatePaddleInput, CreatePaddleOutPut } from './dto/create-paddle.dto';
import { GetPaddlesOutPut } from './dto/get-paddles.dto';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async createPaddle(
    user: User,
    createPaddleInput: CreatePaddleInput,
  ): Promise<CreatePaddleOutPut> {
    try {
      const restaurant = await this.prisma.restaurant.findUnique({
        where: { id: createPaddleInput.restaurantId },
      });

      if (!restaurant) {
        return {
          ok: false,
          error: 'Restaurant not found.',
        };
      }
      if (restaurant.userId !== user.id) {
        return {
          ok: false,
          error: 'You are not allowed todo this.',
        };
      }
      const paddle = await this.prisma.payment.create({
        data: {
          transactionId: createPaddleInput.transactionId,
          userId: user.id,
          restaurantId: restaurant.id,
        },
      });
      return {
        ok: true,
        id: paddle.id,
      };
    } catch (error) {
      return {
        ok: false,
        error: "Can't paddle not found.",
      };
    }
  }

  async getPaddles(user: User): Promise<GetPaddlesOutPut> {
    try {
      const payments = await this.prisma.payment.findMany({
        where: { userId: user.id },
      });
      return {
        ok: true,
        payments,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Could not load paddles.',
      };
    }
  }
}
