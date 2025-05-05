import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '@src/controllers/auth.controller';
import { AuthModule } from '@src/modules/auth.module';
import { AuthService } from '@src/services/auth.service';

describe('AuthModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        AuthModule,
        JwtModule.register({
          global: true,
          secret: 'testSecret',
          signOptions: { expiresIn: '3600s' },
        }),
      ],
    })
      .overrideProvider(AuthService)
      .useValue({})
      .compile();
  });

  it('should compile the module', () => {
    expect(module).toBeDefined();
  });

  it('should provide AuthService', () => {
    const authService = module.get<AuthService>(AuthService);
    expect(authService).toBeDefined();
  });

  it('should provide AuthController', () => {
    const authController = module.get<AuthController>(AuthController);
    expect(authController).toBeDefined();
  });
});
