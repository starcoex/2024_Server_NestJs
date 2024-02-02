import { Field, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from '../../user/entities/user.entity';

@ObjectType()
export class Verification extends CoreEntity {
  @Field(() => String, { nullable: true })
  code?: string;

  @Field(() => User, { nullable: true })
  user?: User;
}
