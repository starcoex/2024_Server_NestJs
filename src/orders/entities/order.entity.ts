import { Field, Float, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { User } from 'src/user/entities/user.entity';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
  Pending = 'Pending',
  Cooking = 'Cooking',
  Cooked = 'Cooked',
  PickedUp = 'PickedUp',
  Delivered = 'Delivered',
}

registerEnumType(OrderStatus, { name: 'OrderStatus' });

@ObjectType()
export class Order extends CoreEntity {
  @Field(() => Float, { nullable: true })
  total?: number;

  @Field(() => OrderStatus)
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @Field(() => Restaurant)
  restaurant: Restaurant;

  @Field(() => [OrderItem], { nullable: true })
  items?: OrderItem[];

  @Field(() => User, { nullable: true })
  customer?: User;

  @Field(() => User, { nullable: true })
  driver?: User;
  driverId: number;
  customerId: number;
}
