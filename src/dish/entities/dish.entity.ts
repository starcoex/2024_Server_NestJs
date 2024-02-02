import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { DishOption } from './dish-option.entity';
import { OrderItem } from 'src/orders/entities/order-item.entity';

@ObjectType()
export class Dish extends CoreEntity {
  @Field(() => String)
  @IsString()
  @Length(2)
  name: string;

  @Field(() => Int)
  @IsNumber()
  price: number;

  @Field(() => String, { nullable: true })
  @IsString()
  photo?: string;

  @Field(() => String)
  @Length(2, 140)
  description: string;

  @Field(() => Restaurant, { nullable: true })
  restaurant?: Restaurant;

  @Field(() => [OrderItem], { nullable: true })
  orderItems?: OrderItem[];

  @Field(() => [DishOption], { nullable: true })
  options?: DishOption[];
}
