import { Field, ObjectType } from '@nestjs/graphql';
import { MinLength } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';

@ObjectType()
export class Category extends CoreEntity {
  @Field(() => String)
  @MinLength(2)
  name: string;

  @Field(() => String)
  slug: string;

  @Field(() => String, { nullable: true })
  coverImg?: string;

  @Field(() => [Restaurant], { nullable: true })
  restaurants?: Restaurant[];
}
