import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Pagination {
  @Field(() => String)
  cursor: string;

  @Field(() => Int, { defaultValue: 1 })
  page: number;
}
