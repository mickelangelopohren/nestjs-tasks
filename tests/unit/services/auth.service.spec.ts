import { Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaDatabase } from '@src/database/prisma.database';
import { AuthService } from '@src/services/auth.service';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;

  const prismaMock = {
    user: {
      findUnique: jest.fn(),
    },
  };

  const jwtServiceMock = {
    sign: jest.fn(),
  };

  const loggerMock = {
    log: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaDatabase, useValue: prismaMock },
        { provide: JwtService, useValue: jwtServiceMock },
        { provide: Logger, useValue: loggerMock },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('validateUser', () => {
    it('should return user details if credentials are valid', async () => {
      const mockUser = {
        id: 1,
        userName: 'testUser',
        password: await bcrypt.hash('testPassword', 10),
        role: 'user',
      };

      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      const result = await authService.validateUser({
        userName: 'testUser',
        password: 'testPassword',
      });

      expect(result).toEqual({
        id: mockUser.id,
        userName: mockUser.userName,
        role: mockUser.role,
      });
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(
        authService.validateUser({
          userName: 'testUser',
          password: 'testPassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const mockUser = {
        id: 1,
        userName: 'testUser',
        password: await bcrypt.hash('testPassword', 10),
        role: 'user',
      };

      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      await expect(
        authService.validateUser({
          userName: 'testUser',
          password: 'wrongPassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('signIn', () => {
    it('should return access token if credentials are valid', async () => {
      const mockUser = {
        id: 1,
        userName: 'testUser',
        role: 'user',
      };

      jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUser);
      jwtServiceMock.sign.mockReturnValue('mockAccessToken');

      const result = await authService.signIn({
        userName: 'testUser',
        password: 'testPassword',
      });

      expect(result).toEqual({
        accessToken: 'mockAccessToken',
        expiresIn: process.env.JWT_EXPIRATION,
      });
    });
  });

  describe('JWT_EXPIRATION fallback', () => {
    it('should use the fallback value if JWT_EXPIRATION is not set', async () => {
      delete process.env.JWT_EXPIRATION;

      const authServiceInstance = new AuthService(
        jwtServiceMock as unknown as JwtService,
        prismaMock as unknown as PrismaDatabase,
        loggerMock as unknown as Logger,
      );

      expect(authServiceInstance['JWT_EXPIRATION']).toBe('3600s');
    });
  });
});
