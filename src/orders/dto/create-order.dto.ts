import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { Order } from '../entities/order.entity';
import { CoreOutput } from 'src/common/dto/output.dto';
import { OrderItemOption } from '../entities/order-item.entity';

@InputType()
export class CreateOrderItemInput {
  @Field(() => Int)
  dishId: number;

  @Field(() => [OrderItemOption], { nullable: true })
  options: OrderItemOption[];
}

@InputType()
export class CreateOrderInput extends PickType(
  Order,
  ['total', 'status'],
  InputType,
) {
  @Field(() => Int)
  retaurantId: number;

  @Field(() => [CreateOrderItemInput])
  items: CreateOrderItemInput[];
}

@ObjectType()
export class CreateOrderOutput extends CoreOutput {}
