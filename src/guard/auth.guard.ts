import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = request.cookies['accessToken'];

    if (!token) {
      throw new UnauthorizedException('Token not found in cookies');
    }

    try {
      const payload = this.jwtService.verify(token);
      request.userId = payload.sub;
    } catch (e) {
      Logger.error(e);
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }
}
