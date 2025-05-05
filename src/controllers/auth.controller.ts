import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SignInDto } from '@src/commons/dto/signin.dto';
import { AuthResponse } from '@src/commons/interface/auth.interface';
import { Public } from '@src/commons/utils/auth.utils';
import { AuthService } from '@src/services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signIn(@Body() signInDto: SignInDto): Promise<AuthResponse> {
    return this.authService.signIn(signInDto);
  }
}
