import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { DishChoice } from './dish-choice.entity';

@InputType('DishOptionInputType', { isAbstract: true })
@ObjectType()
export class DishOption {
  @Field(() => String)
  name: string;

  @Field(() => Int, { nullable: true })
  extra?: number;

  @Field(() => [DishChoice], { nullable: true })
  choice?: DishChoice[];
}
