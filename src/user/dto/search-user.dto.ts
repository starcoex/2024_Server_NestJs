import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import {
  PaginationPageInput,
  PaginationPageOutput,
} from 'src/common/dto/pagination-page.dot';
import { User } from '../entities/user.entity';

@InputType()
export class SerachUserInput extends PaginationPageInput {
  @Field(() => String)
  query: string;
}

@ObjectType()
export class SearchUserOutput extends PaginationPageOutput {
  @Field(() => [User], { nullable: true })
  users?: User[];
}
