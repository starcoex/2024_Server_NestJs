import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { CoreOutput } from 'src/common/dto/output.dto';

@InputType()
export class ProfileUserInput extends PickType(User, ['id'], InputType) {}

@ObjectType()
export class ProfileUserOutput extends CoreOutput {
  @Field(() => User, { nullable: true })
  user?: User;
}
