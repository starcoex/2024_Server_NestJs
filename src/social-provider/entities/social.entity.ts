import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/user/entities/user.entity';

export enum SocialProviderTypes {
  Facebook = 'Facebook',
  Google = 'Google',
  Kakao = 'Kakao',
  Naver = 'Naver',
  Github = 'Github',
}
registerEnumType(SocialProviderTypes, {
  name: 'SocialProviderTypes',
});

@ObjectType()
export class SocialProvider extends CoreEntity {
  @Field(() => String, { nullable: true })
  socialId?: string;

  @Field(() => SocialProviderTypes, { nullable: true })
  @IsEnum(SocialProviderTypes)
  provider?: SocialProviderTypes;

  @Field(() => [User], { nullable: true })
  users?: User[];
}
