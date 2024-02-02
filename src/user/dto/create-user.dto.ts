import {
  InputType,
  Field,
  PickType,
  ObjectType,
  PartialType,
} from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { CoreOutput } from 'src/common/dto/output.dto';
import { Verification } from '../../verification/entities/verification.entity';

@InputType()
export class CreateUserInput extends PickType(
  User,
  ['userName', 'email', 'password', 'role', 'emailVerified'],
  InputType,
) {}

@ObjectType()
export class CreateUserOutput extends CoreOutput {
  @Field(() => User, { nullable: true })
  user?: User;
}
