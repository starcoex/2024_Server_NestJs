import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { Profile } from '../entitles/profile.entity';
import { CoreOutput } from 'src/common/dto/output.dto';

@InputType()
export class GetIdPorofileInput extends PickType(Profile, ['id'], InputType) {}

@ObjectType()
export class GetIdProfileOutput extends CoreOutput {
  @Field(() => Profile, { nullable: true })
  profile?: Profile;
}
