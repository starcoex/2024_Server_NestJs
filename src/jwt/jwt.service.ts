import { Inject, Injectable } from '@nestjs/common';
import { JwtModuleOptions } from './interfaces/jwt-module-options.interface';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOptions,
  ) {}

  accessToken(payload: object): string {
    return jwt.sign(payload, this.options.privateKey);
  }
  refreshToken(payload: object): string {
    return jwt.sign(payload, this.options.refreshKey);
  }
  verifyToken(token: string) {
    return jwt.verify(token, this.options.privateKey);
  }
  verifyRefreshToken(token: string) {
    return jwt.verify(token, this.options.refreshKey);
  }
}
