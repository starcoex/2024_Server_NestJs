import { registerAs } from '@nestjs/config';

export default registerAs('kakao', () => ({
  clientId: process.env.KAKAO_ID,
  clientSecret: process.env.KAKAO_SECRET,
}));
