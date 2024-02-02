import { InputType, Int, Field, PickType, ObjectType } from '@nestjs/graphql';
import { Payment } from '../entities/payment.entity';
import { CoreOutput } from 'src/common/dto/output.dto';

@InputType()
export class CreatePaddleInput extends PickType(
  Payment,
  ['transactionId'],
  InputType,
) {
  @Field(() => Int)
  restaurantId: number;
}

@ObjectType()
export class CreatePaddleOutPut extends CoreOutput {}
