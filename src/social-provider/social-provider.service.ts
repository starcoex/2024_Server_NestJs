import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from 'src/prisma/prisma.service';
import { KakaoUserInput, KakaoUserOutput } from './dto/kakao-user.dto';
import passport from 'passport';
import { Strategy as KakaoStrategy } from 'passport-kakao';

@Injectable()
export class SocialProviderService {
  constructor(private readonly prisma: PrismaService) {}

  // async getSocialId(socialAccessToken: string): Promise<any> {
  //   const { data } = await axios.get(`https://kapi.kakao.com/v2/user/me`, {
  //     headers: { authorization: `Bearer ${socialAccessToken}` },
  //   });
  //   return data;
  // }

  // async kakaoUser(kakaoUserInput: KakaoUserInput): Promise<KakaoUserOutput> {
  //   try {
  //     const userSocial = this.prisma.socialProvider.findUnique({
  //       where: { id: kakaoUserInput.id },
  //     });
  //     if (!userSocial) {
  //       return {
  //         ok: false,
  //         error: 'SocialKakao user not found.',
  //       };
  //     }
  //     const kakao = passport.use(
  //       new KakaoStrategy({
  //         clientID: process.env.KAKAO_SECRET,
  //         callbackURL: '/auth/kakao/callback',
  //       }),
  //     );
  //     const newUser = await this.prisma.socialProvider.create({
  //       data: {
  //         provider: 'Kakao',
  //         socialId: kakaoUserInput.id as unknown as string,
  //       },
  //     });
  //     console.log(newUser);
  //     return {
  //       ok: true,
  //     };
  //   } catch (error) {}
  // }
}
