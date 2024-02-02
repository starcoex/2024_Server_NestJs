import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { DishOption } from 'src/dish/entities/dish-option.entity';
import { Dish } from 'src/dish/entities/dish.entity';

@InputType('OrderItemOptionInputType', { isAbstract: true })
@ObjectType()
export class OrderItemOption {
  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  choice?: string;
}

@ObjectType()
export class OrderItem extends CoreEntity {
  @Field(() => Dish, { nullable: true })
  dish?: Dish;

  @Field(() => [OrderItemOption], { nullable: true })
  options?: OrderItemOption[];
}
