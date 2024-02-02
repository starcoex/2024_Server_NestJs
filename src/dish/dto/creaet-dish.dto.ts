import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { Dish } from '../entities/dish.entity';
import { CoreOutput } from 'src/common/dto/output.dto';

@InputType()
export class CreateDishInput extends PickType(
  Dish,
  ['name', 'price', 'description', 'options'],
  InputType,
) {
  @Field(() => Int)
  restaurantId: number;
}

@ObjectType()
export class CreaetDishOutput extends CoreOutput {}