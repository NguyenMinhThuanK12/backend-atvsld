import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from 'libs/core/services/auth.service';
import { AuthRequest } from 'libs/shared/ATVSLD/models/requests/auth/auth.request';
import { ApiResponse } from 'libs/shared/ATVSLD/common/api-response';
import { SUCCESS_LOGIN } from 'libs/shared/ATVSLD/constants/success-message.constant';
import { ForgotPasswordRequest } from 'libs/shared/ATVSLD/models/requests/auth/forgot-password.request';
import { ResetPasswordRequest } from 'libs/shared/ATVSLD/models/requests/auth/reset-password.request';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK) 
  async login(@Body() authRequest: AuthRequest) {
    const user = await this.authService.validateUser(
      authRequest.account,
      authRequest.password,
      authRequest.department_id,
    );
    
    const data = await this.authService.login(user);
    return ApiResponse.success(HttpStatus.OK, SUCCESS_LOGIN, data);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() body: { refresh_token: string }) {
    const access_token = await this.authService.refreshAccessToken(body.refresh_token);
    return ApiResponse.success(HttpStatus.OK, 'Làm mới access token thành công', {access_token});
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body() body: { refresh_token: string }) {
    await this.authService.logout(body.refresh_token);
    return ApiResponse.success(HttpStatus.OK, 'Đăng xuất thành công',null);
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