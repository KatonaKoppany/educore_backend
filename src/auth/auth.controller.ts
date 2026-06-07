import {
  Body,
  Controller,
  Logger,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-tokens.dto';
import { TokenService } from '@/token/token.service';
import type { Response, Request } from 'express';
import {
  ACCESS_COOKIE_OPTIONS,
  COOKIE_BASE_OPTIONS,
  REFRESH_COOKIE_OPTIONS,
} from './auth.constants';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private tokenService: TokenService,
  ) {}

  // ==========================================
  // SignUp
  // ==========================================
  @Post('signup')
  async signUp(@Body() signupData: SignupDto) {
    return this.authService.signUp(signupData);
  }

  // ==========================================
  // Login
  // ==========================================
  @Post('login')
  async login(
    @Body() loginData: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.login(loginData);

    res.cookie('accessToken', tokens.accessToken, ACCESS_COOKIE_OPTIONS);
    res.cookie('refreshToken', tokens.refreshToken, REFRESH_COOKIE_OPTIONS);

    return { message: 'Login successful' };
  }

  // ==========================================
  // Refresh
  // ==========================================
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    try {
      const newTokens = await this.tokenService.refreshTokens(refreshToken);

      res.cookie('accessToken', newTokens.accessToken, ACCESS_COOKIE_OPTIONS);
      res.cookie(
        'refreshToken',
        newTokens.refreshToken,
        REFRESH_COOKIE_OPTIONS,
      );

      return { message: 'Token refreshed' };
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }

  // ==========================================
  // Logout
  // ==========================================
  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies['refreshToken'];

    if (refreshToken) {
      await this.tokenService.deleteRefreshToken(refreshToken);
    }

    res.clearCookie('accessToken', COOKIE_BASE_OPTIONS);
    res.clearCookie('refreshToken', COOKIE_BASE_OPTIONS);

    return { message: 'Logged out successfully' };
  }
}
