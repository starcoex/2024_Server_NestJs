import { ObjectType, Field } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
export class Payment extends CoreEntity {
  @Field(() => String)
  transactionId: string;

  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => Restaurant, { nullable: true })
  restaurant?: Restaurant;
}
