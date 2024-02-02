import {
  InputType,
  Field,
  PickType,
  ObjectType,
  PartialType,
} from '@nestjs/graphql';
import { User } from '../../user/entities/user.entity';
import { CoreOutput } from 'src/common/dto/output.dto';
import { Verification } from '../../verification/entities/verification.entity';
import { SocialProvider, SocialProviderTypes } from '../entities/social.entity';

@InputType()
export class KakaoUserInput extends PartialType(
  PickType(SocialProvider, ['id', 'socialId'], InputType),
) {
  @Field(() => SocialProviderTypes)
  provider: SocialProviderTypes;
}

@ObjectType()
export class KakaoUserOutput extends CoreOutput {
  @Field(() => SocialProvider, { nullable: true })
  socialProvider?: SocialProvider;
}
