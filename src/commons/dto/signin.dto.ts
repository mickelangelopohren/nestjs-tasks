import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class SignInDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  readonly userName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  readonly password: string;
}
