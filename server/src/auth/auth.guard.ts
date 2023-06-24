import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const header = req.headers.authorization;
      console.log(header);

      const bearer = header.split(' ')[0];
      const token = header.split(' ')[1];
      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({
          message: 'Пользователь не авторизован',
        });
      }
      const user: any = this.jwtService.verify(token);
      console.log(user);

      req.userId = user.userId;
      return true;
    } catch (err) {
      console.log('here');

      throw new UnauthorizedException({
        message: 'Пользователь не авторизован',
      });
    }
  }
}
