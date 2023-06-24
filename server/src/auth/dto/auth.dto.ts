import { IsString, MinLength } from 'class-validator';

export class AuthDto {
  @IsString()
  username: string;
  @IsString()
  @MinLength(2, { message: 'Минимальная длина строки - 2' })
  password: string;
}
