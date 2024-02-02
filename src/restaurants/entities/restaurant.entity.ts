import { Field, ObjectType } from '@nestjs/graphql';
import { Category } from 'src/category/entities/category.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Dish } from 'src/dish/entities/dish.entity';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
export class Restaurant extends CoreEntity {
  @Field(() => String, { nullable: true })
  restaruantId?: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  coverImg: string;

  @Field(() => String)
  address: string;

  @Field(() => Category, { nullable: true })
  category?: Category;

  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => [Dish])
  menu?: Dish[];
  userId: number;
}
