import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '@src/guards/auth.guard';

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
describe('AuthGuard', () => {
  let authGuard: AuthGuard;

  const jwtServiceMock = {
    verify: jest.fn(),
  };

  const reflectorMock = {
    getAllAndOverride: jest.fn(),
  };

  const createContextMock = (
    requestMock: Record<string, any>,
  ): Partial<ExecutionContext> => ({
    switchToHttp: jest.fn().mockReturnValue({ getRequest: () => requestMock }),
    getHandler: jest.fn(),
    getClass: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        { provide: JwtService, useValue: jwtServiceMock },
        { provide: Reflector, useValue: reflectorMock },
      ],
    }).compile();

    authGuard = module.get<AuthGuard>(AuthGuard);
  });

  describe('canActivate', () => {
    it('should allow access to public routes', async () => {
      reflectorMock.getAllAndOverride = jest.fn().mockReturnValue(true);

      const contextMock = createContextMock({});

      const result = await authGuard.canActivate(
        contextMock as ExecutionContext,
      );

      expect(result).toBe(true);
    });

    it('should throw UnauthorizedException if token is missing', async () => {
      reflectorMock.getAllAndOverride = jest.fn().mockReturnValue(false);

      const requestMock = { headers: {} };
      const contextMock = createContextMock(requestMock);

      await expect(
        authGuard.canActivate(contextMock as ExecutionContext),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
      reflectorMock.getAllAndOverride = jest.fn().mockReturnValue(false);

      const requestMock = { headers: { authorization: 'Bearer invalidToken' } };
      const contextMock = createContextMock(requestMock);

      jwtServiceMock.verify = jest.fn().mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(
        authGuard.canActivate(contextMock as ExecutionContext),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should allow access if token is valid', async () => {
      reflectorMock.getAllAndOverride = jest.fn().mockReturnValue(false);

      const requestMock = { headers: { authorization: 'Bearer validToken' } };
      const contextMock = createContextMock(requestMock);

      jwtServiceMock.verify = jest
        .fn()
        .mockReturnValue({ id: 1, role: 'user' });

      const result = await authGuard.canActivate(
        contextMock as ExecutionContext,
      );

      expect(result).toBe(true);
      expect(requestMock['user']).toEqual({ id: 1, role: 'user' });
    });
  });

  describe('extractTokenFromHeader', () => {
    it('should return undefined if Authorization header is missing', () => {
      const requestMock = { headers: {} };

      const result = (authGuard as any).extractTokenFromHeader(requestMock);

      expect(result).toBeUndefined();
    });

    it('should return undefined if Authorization header is malformed', () => {
      const requestMock = { headers: { authorization: 'MalformedHeader' } };

      const result = (authGuard as any).extractTokenFromHeader(requestMock);

      expect(result).toBeUndefined();
    });

    it('should return the token if Authorization header is valid', () => {
      const requestMock = { headers: { authorization: 'Bearer validToken' } };

      const result = (authGuard as any).extractTokenFromHeader(requestMock);

      expect(result).toBe('validToken');
    });
  });
});
