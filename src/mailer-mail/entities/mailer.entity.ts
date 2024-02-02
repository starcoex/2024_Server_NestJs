import { Field, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';

@ObjectType()
export class Mailer extends CoreEntity {
  @Field(() => String)
  to: string;

  @Field(() => String)
  subject: string;
}
