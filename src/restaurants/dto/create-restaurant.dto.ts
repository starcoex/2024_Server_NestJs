import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { Restaurant } from '../entities/restaurant.entity';
import { CoreOutput } from 'src/common/dto/output.dto';

@InputType()
export class CreateRestaurantInput extends PartialType(
  PickType(Restaurant, ['address', 'coverImg', 'name'], InputType),
) {
  @Field(() => String)
  categoryName: string;
}

@ObjectType()
export class CreateRestaurantOutput extends CoreOutput {}
