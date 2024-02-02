import { InputType, PickType } from '@nestjs/graphql';
import { Order } from '../entities/order.entity';

@InputType()
export class SubscriptionOrderUpdatesInput extends PickType(
  Order,
  ['id'],
  InputType,
) {}
