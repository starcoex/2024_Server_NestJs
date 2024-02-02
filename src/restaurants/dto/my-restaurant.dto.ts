import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { Restaurant } from '../entities/restaurant.entity';
import { CoreOutput } from 'src/common/dto/output.dto';

@InputType()
export class MyRestaurantInput extends PickType(
  Restaurant,
  ['id'],
  InputType,
) {}

@ObjectType()
export class MyRestaurantOutput extends CoreOutput {
  @Field(() => Restaurant, { nullable: true })
  restaurant?: Restaurant;
}
