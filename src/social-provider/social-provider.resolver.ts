import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { SocialProviderService } from './social-provider.service';
import { KakaoUserInput, KakaoUserOutput } from './dto/kakao-user.dto';

@Resolver()
export class SocialProviderResolver {
  constructor(private readonly socialProviderService: SocialProviderService) {}

  // @Mutation(() => KakaoUserOutput)
  // kakaoUser(
  //   @Args('input') kakaoUserInput: KakaoUserInput,
  // ): Promise<KakaoUserOutput> {
  //   return this.socialProviderService.kakaoUser(kakaoUserInput);
  // }
}
