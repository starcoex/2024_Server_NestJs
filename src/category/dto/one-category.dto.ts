import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { Category } from '../entities/category.entity';
import {
  PaginationPageInput,
  PaginationPageOutput,
} from 'src/common/dto/pagination-page.dot';

@InputType()
export class OneCategoryInput extends PaginationPageInput {
  @Field(() => String)
  slug: string;
}

@ObjectType()
export class OneCategoryOutput extends PaginationPageOutput {
  @Field(() => Category, { nullable: true })
  category?: Category;

  @Field(() => Int, { nullable: true })
  totalPages?: number;

  @Field(() => Int, { nullable: true })
  totalResults?: number;
}
