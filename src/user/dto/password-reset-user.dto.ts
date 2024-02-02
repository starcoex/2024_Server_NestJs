import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { CoreOutput } from 'src/common/dto/output.dto';

@InputType()
export class PasswordResetUserInput extends PartialType(
  PickType(User, ['email', 'password'], InputType),
) {}

@ObjectType()
export class PasswordResetUserOutput extends CoreOutput {
  @Field(() => User, { nullable: true })
  user?: User;
}
