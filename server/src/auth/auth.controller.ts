import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { AuthGuard } from './auth.guard';
// import { AuthGuard } from '@nestjs/passport';

@UseInterceptors(CacheInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() dto: AuthDto) {
    return this.authService.register(dto);
  }

  @Post('/login')
  async login(@Req() req, @Res() res, @Body() dto: AuthDto) {
    const { username, password } = dto;
    return this.authService.login(res, username, password);
  }

  // @UseGuards(JwtAuthGuard)
  @Post('/refresh')
  async refresh(@Body('refresh_token') refresh_token: string) {
    // const refreshToken: string = req.cookies.jid;
    console.log(refresh_token);

    return this.authService.refresh(refresh_token);
  }

  // @UseGuards(JwtAuthGuard)
  // @Post()
  // async getMe(@Req() req) {
  //   return 'ok';
  // }
  @UseGuards(AuthGuard)
  @Post()
  async me(@Req() req) {
    return this.authService.getMe(req);
  }
}
