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
export class EditProfileUserInput extends PartialType(
  PickType(User, ['email', 'password', 'userName'], InputType),
) {}

@ObjectType()
export class EditProfileUserOutput extends CoreOutput {
  @Field(() => User, { nullable: true })
  user?: User;
}
