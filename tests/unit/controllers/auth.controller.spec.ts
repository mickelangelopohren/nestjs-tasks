import { Test, TestingModule } from '@nestjs/testing';
import { SignInDto } from '@src/commons/dto/signin.dto';
import { AuthResponse } from '@src/commons/interface/auth.interface';
import { AuthController } from '@src/controllers/auth.controller';
import { AuthService } from '@src/services/auth.service';

describe('AuthController', () => {
  let authController: AuthController;

  const authServiceMock = {
    signIn: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('signIn', () => {
    it('should call AuthService.signIn with correct arguments', async () => {
      const signInDto: SignInDto = {
        userName: 'testUser',
        password: 'testPass',
      };
      const authResponse: AuthResponse = {
        accessToken: 'testToken',
        expiresIn: '3600s',
      };

      jest.spyOn(authServiceMock, 'signIn').mockResolvedValue(authResponse);

      const result = await authController.signIn(signInDto);

      expect(authServiceMock.signIn).toHaveBeenCalledWith(signInDto);
      expect(result).toEqual(authResponse);
    });
  });
});
