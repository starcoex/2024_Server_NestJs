import { InputType, PartialType, PickType } from '@nestjs/graphql';
import { Payment } from '../entities/payment.entity';

@InputType()
export class UpdatePaddleInput extends PartialType(
  PickType(Payment, ['id', 'transactionId'], InputType),
) {}
