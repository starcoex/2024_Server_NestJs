import { Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';
import { Dish } from '../entities/dish.entity';

@ObjectType()
export class AllDishOutput extends CoreOutput {
  @Field(() => [Dish], { nullable: true })
  dish?: Dish[];
}
