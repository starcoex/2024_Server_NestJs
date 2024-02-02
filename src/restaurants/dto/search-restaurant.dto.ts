import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import {
  PaginationPageInput,
  PaginationPageOutput,
} from 'src/common/dto/pagination-page.dot';
import { Restaurant } from '../entities/restaurant.entity';

@InputType()
export class SerachRestaurantInput extends PaginationPageInput {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String)
  query: string;
}

@ObjectType()
export class SearchRestaurantOutput extends PaginationPageOutput {
  @Field(() => [Restaurant], { nullable: true })
  restaurants?: Restaurant[];

  @Field(() => Int, { nullable: true })
  totalPages?: number;

  @Field(() => Int, { nullable: true })
  totalResults?: number;
}
