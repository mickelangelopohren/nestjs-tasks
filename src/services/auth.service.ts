import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { SignInDto } from '@src/commons/dto/signin.dto';
import { AuthResponse } from '@src/commons/interface/auth.interface';
import { PrismaDatabase } from '@src/database/prisma.database';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly INVALID_CREDENTIALS_ERROR = 'Invalid credentials';
  private readonly JWT_EXPIRATION = process.env.JWT_EXPIRATION || '3600s';

  constructor(
    private jwtService: JwtService,
    private prisma: PrismaDatabase,
    private readonly logger: Logger,
  ) {}

  async validateUser(loginUserDto: SignInDto): Promise<Omit<User, 'password'>> {
    const user = await this.prisma.user.findUnique({
      where: { userName: loginUserDto.userName },
    });

    if (!user) {
      throw new UnauthorizedException(this.INVALID_CREDENTIALS_ERROR);
    }

    const isCorrectPassword = await this.validatePassword(
      loginUserDto.password,
      user.password,
    );

    if (!isCorrectPassword) {
      throw new UnauthorizedException(this.INVALID_CREDENTIALS_ERROR);
    }

    const { id, userName, role } = user;
    return { id, userName, role };
  }

  private async validatePassword(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }

  async signIn(loginUserDto: SignInDto): Promise<AuthResponse> {
    this.logger.log(`Sign-in attempt for username: ${loginUserDto.userName}`);

    const user = await this.validateUser(loginUserDto);

    const payload = this.createJwtPayload(user);

    return {
      accessToken: this.jwtService.sign(payload),
      expiresIn: this.JWT_EXPIRATION,
    };
  }

  private createJwtPayload(user: Omit<User, 'password'>): Record<string, any> {
    return {
      username: user.userName,
      sub: user.id,
      role: user.role,
    };
  }
}
