import {
  ArgsType,
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { Profile } from '../entitles/profile.entity';
import { CoreOutput } from 'src/common/dto/output.dto';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';

@InputType()
export class EditProfileInput extends PartialType(
  PickType(Profile, ['bio', 'id', 'avatarUrl'], InputType),
) {}

@ArgsType()
export class EditProfileFileInput {
  @Field(() => GraphQLUpload, { nullable: true })
  file?: GraphQLUpload;
}

@ObjectType()
export class EditProfileOutput extends CoreOutput {
  @Field(() => Profile, { nullable: true })
  profile?: Profile;
}
