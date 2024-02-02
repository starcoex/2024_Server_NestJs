import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from './jwt.service';
import { UserService } from 'src/user/user.service';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    if ('authorization' in req.headers) {
      const token = req.headers['authorization'];
      try {
        const decoded = this.jwtService.verifyToken(String(token));
        if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
          const { ok, user } = await this.userService.findById(decoded['id']);
          console.log(user);
          if (ok) {
            req['user'] = user;
          }
        }
      } catch (error) {
        // throw new UnauthorizedException();
      }
    }
    next();
  }
}
