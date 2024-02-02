import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PaymentsService } from './payments.service';
import { CreatePaddleInput, CreatePaddleOutPut } from './dto/create-paddle.dto';
import { Role } from 'src/auth/auth-role.decorator';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { Payment } from './entities/payment.entity';
import { GetPaddlesOutPut } from './dto/get-paddles.dto';

@Resolver(() => Payment)
export class PaymentsResolver {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Mutation(() => CreatePaddleOutPut)
  @Role(['Owner'])
  createPaddle(
    @AuthUser() user: User,
    @Args('input') createPaddleInput: CreatePaddleInput,
  ): Promise<CreatePaddleOutPut> {
    return this.paymentsService.createPaddle(user, createPaddleInput);
  }

  @Query(() => GetPaddlesOutPut)
  @Role(['Owner'])
  getPaddles(@AuthUser() user: User): Promise<GetPaddlesOutPut> {
    return this.paymentsService.getPaddles(user);
  }
}
