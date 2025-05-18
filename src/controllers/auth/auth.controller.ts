import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from 'libs/core/services/auth.service';
import { AuthRequest } from '../../../libs/shared/ATVSLD/models/requests/auth/auth.request';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() authRequest: AuthRequest) {
    const user = await this.authService.validateUser(
      authRequest.account,
      authRequest.password,
      authRequest.department_id,
    );
    return this.authService.login(user);
  }

  @Post('refresh-token')
  refresh(@Body() body: { refresh_token: string }) {
    return this.authService.refreshAccessToken(body.refresh_token);
  }

  @Post('logout')
  logout(@Body() body: { refresh_token: string }) {
    return this.authService.logout(body.refresh_token);
  }
}