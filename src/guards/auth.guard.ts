import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { User } from '@src/commons/interface/user.interface';
import { IS_PUBLIC_KEY } from '@src/commons/utils/auth.utils';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly JWT_SECRET = process.env.JWT_SECRET;

  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private readonly logger: Logger,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.isPublicRoute(context)) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      this.logger.warn('Authorization token is missing');
      throw new UnauthorizedException(
        'Authorization token is missing from the request headers',
      );
    }

    try {
      const user = await this.validateAndDecodeToken(token);
      request['user'] = user;
    } catch {
      this.logger.error('Invalid or expired token');

      throw new UnauthorizedException('Invalid or expired token');
    }

    return true;
  }

  private isPublicRoute(context: ExecutionContext): boolean {
    return this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return undefined;
    }

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) {
      return undefined;
    }

    return token;
  }

  private async validateAndDecodeToken(token: string): Promise<Partial<User>> {
    try {
      return this.jwtService.verify<Partial<User>>(token, {
        secret: this.JWT_SECRET,
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
