import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AllowedRoles } from './auth-role.decorator';
import { JwtService } from 'src/jwt/jwt.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  // constructor(private readonly reflector: Reflector) {}
  // canActivate(context: ExecutionContext) {
  //   try {
  //     const roles = this.reflector.get<AllowedRoles>(
  //       'roles',
  //       context.getHandler(),
  //     );
  //     console.log(roles);
  //     if (!roles) {
  //       return true;
  //     }
  //     const gqlContext = GqlExecutionContext.create(context).getContext();
  //     const user: User = gqlContext['user'];
  //     if (!user) {
  //       return false;
  //     }
  //     if (roles.includes('Any')) {
  //       return true;
  //     }
  //     return roles.includes(user.role);
  //   } catch (error) {
  //     throw new UnauthorizedException();
  //   }
  // }
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext) {
    try {
      const roles = this.reflector.get<AllowedRoles>(
        'roles',
        context.getHandler(),
      );
      if (!roles) {
        return true;
      }
      const gqlContext = GqlExecutionContext.create(context).getContext();
      const token = gqlContext.token;
      if (token) {
        const decodedToken = this.jwtService.verifyToken(String(token));
        if (
          typeof decodedToken === 'object' &&
          decodedToken.hasOwnProperty('id')
        ) {
          const { user } = await this.userService.findById(decodedToken['id']);
          if (!user) {
            return false;
          }
          gqlContext['user'] = user;
          if (roles.includes('Any')) {
            return true;
          }
          return roles.includes(user.role);
        } else {
          return false;
        }
      } else {
        return false;
      }
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
