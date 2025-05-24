import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from 'libs/core/services/auth.service';
import { AuthRequest } from 'libs/shared/ATVSLD/models/requests/auth/auth.request';
import { ApiResponse } from 'libs/shared/ATVSLD/common/api-response';

import { ForgotPasswordRequest } from 'libs/shared/ATVSLD/models/requests/auth/forgot-password.request';
import { ResetPasswordRequest } from 'libs/shared/ATVSLD/models/requests/auth/reset-password.request';
import {
  SUCCESS_LOGIN,
  SUCCESS_LOGOUT,
  SUCCESS_REFRESH_TOKEN,
} from 'libs/shared/ATVSLD/constants/auth-message.constant';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() authRequest: AuthRequest) {
    const data = await this.authService.login(authRequest.account, authRequest.password);
    return ApiResponse.success(HttpStatus.OK, SUCCESS_LOGIN, data);
  }

  @Post('refresh-token')
  async refresh(@Body() body: { refresh_token: string }) {
    const access_token = await this.authService.refreshAccessToken(body.refresh_token);
    return ApiResponse.success(HttpStatus.OK, SUCCESS_REFRESH_TOKEN, {
      access_token,
    });
  }

  @Post('logout')
  async logout(@Body() body: { refresh_token: string }) {
    await this.authService.logout(body.refresh_token);
    return ApiResponse.success(HttpStatus.OK, SUCCESS_LOGOUT, null);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordRequest) {
    return this.authService.sendForgotPasswordEmail(dto);
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordRequest) {
    return this.authService.resetPassword(dto);
  }
}
