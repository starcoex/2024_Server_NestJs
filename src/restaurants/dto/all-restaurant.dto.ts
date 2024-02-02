import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import {
  PaginationPageInput,
  PaginationPageOutput,
} from 'src/common/dto/pagination-page.dot';
import { Restaurant } from '../entities/restaurant.entity';
import { number } from 'joi';

@InputType()
export class AllRestaurantInput extends PaginationPageInput {
  @Field(() => String, { nullable: true })
  name?: string;
}

@ObjectType()
export class AllRestaurantOutput extends PaginationPageOutput {
  @Field(() => [Restaurant], { nullable: true })
  restaurants?: Restaurant[];

  @Field(() => Int, { nullable: true })
  totalPages?: number;

  @Field(() => Int, { nullable: true })
  totalResults?: number;
}
