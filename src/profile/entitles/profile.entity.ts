import { Field, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
export class Profile extends CoreEntity {
  @Field(() => String, { nullable: true })
  avatarUrl?: string;

  @Field(() => String, { nullable: true })
  bio?: string;

  @Field(() => User, { nullable: true })
  user?: User;
}
