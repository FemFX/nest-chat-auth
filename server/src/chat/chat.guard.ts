import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { JwtPayload } from 'src/interfaces/jwt-payload.interface';
import { ISocket } from 'src/interfaces/socket.interface';

@Injectable()
export class WSAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<ISocket>();
    const authorizationHeader = client.handshake.headers.authorization;
    // console.log(authorizationHeader);

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      return false;
    }
    const token = authorizationHeader.split(' ')[1];
    if (!token) {
      return false;
    }
    const payload: JwtPayload = await this.authService.verifyToken(token);
    if (!payload || !payload.userId) {
      return false;
    }
    client.userId = payload.userId;
    return true;
  }
}
