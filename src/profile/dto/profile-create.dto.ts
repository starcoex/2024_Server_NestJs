import {
  ArgsType,
  Field,
  InputType,
  ObjectType,
  PickType,
} from '@nestjs/graphql';
import { Profile } from '../entitles/profile.entity';
import { CoreOutput } from 'src/common/dto/output.dto';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';

@InputType()
export class CreateProfileInput extends PickType(
  Profile,
  ['avatarUrl', 'bio'],
  InputType,
) {}

@ArgsType()
export class CreateProfileFileInput {
  @Field(() => GraphQLUpload, { nullable: true })
  file?: GraphQLUpload;
}

@ObjectType()
export class CreateProfileOutput extends CoreOutput {
  @Field(() => Profile, { nullable: true })
  profile?: Profile;
}
