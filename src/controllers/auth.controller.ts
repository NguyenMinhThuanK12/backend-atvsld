import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { AuthService } from 'libs/core/services/auth.service';
import { AuthRequest } from 'libs/shared/ATVSLD/models/requests/auth/auth.request';
import { ForgotPasswordRequest } from 'libs/shared/ATVSLD/models/requests/auth/forgot-password.request';
import { ResetPasswordRequest } from 'libs/shared/ATVSLD/models/requests/auth/reset-password.request';
import { ApiResponse } from 'libs/shared/ATVSLD/common/api-response';
import { Public } from 'libs/core/auth/public.decorator';
import {
  SUCCESS_LOGIN,
  SUCCESS_LOGOUT,
  SUCCESS_REFRESH_TOKEN,
} from 'libs/shared/ATVSLD/constants/auth-message.constant';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ------- PUBLIC -------

  @Public()
  @Post('login')
  async login(@Body() authRequest: AuthRequest) {
    const data = await this.authService.login(authRequest.account, authRequest.password);
    return ApiResponse.success(HttpStatus.OK, SUCCESS_LOGIN, data);
  }

  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordRequest) {
    return this.authService.sendForgotPasswordEmail(dto);
  }

  @Public()
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordRequest) {
    return this.authService.resetPassword(dto);
  }

  // ------- AUTHENTICATED -------

  @Post('refresh-token')
  async refresh(@Body() body: { refresh_token: string }) {
    const access_token = await this.authService.refreshAccessToken(body.refresh_token);
    return ApiResponse.success(HttpStatus.OK, SUCCESS_REFRESH_TOKEN, { access_token });
  }

  @Post('logout')
  async logout(@Body() body: { refresh_token: string }) {
    await this.authService.logout(body.refresh_token);
    return ApiResponse.success(HttpStatus.OK, SUCCESS_LOGOUT, null);
  }
}
