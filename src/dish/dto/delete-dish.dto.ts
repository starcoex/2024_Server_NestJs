import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { Dish } from '../entities/dish.entity';
import { CoreOutput } from 'src/common/dto/output.dto';

@InputType()
export class DeleteDishInput extends PickType(Dish, ['id'], InputType) {}

@ObjectType()
export class DeleteDishOutput extends CoreOutput {}
