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
export class EditRestaurantInput extends PartialType(
  PickType(Restaurant, ['address', 'coverImg', 'id', 'name'], InputType),
) {
  @Field(() => String)
  categoryName: string;
}

@ObjectType()
export class EditRestaurantOutput extends CoreOutput {}
