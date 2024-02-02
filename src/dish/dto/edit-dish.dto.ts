import { InputType, ObjectType, PartialType, PickType } from '@nestjs/graphql';
import { Dish } from '../entities/dish.entity';
import { CoreOutput } from 'src/common/dto/output.dto';

@InputType()
export class EditDishInput extends PartialType(
  PickType(Dish, ['name', 'price', 'description', 'options', 'id'], InputType),
) {}

@ObjectType()
export class EditDishOutput extends CoreOutput {}
