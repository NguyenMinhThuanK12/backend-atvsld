import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import ms from 'ms';
import { randomBytes } from 'crypto'; // Để sinh token
import { AuthResponse } from 'libs/shared/ATVSLD/models/response/auth/auth.response';
import { IUserRepository } from 'src/repositories/user/user.repository.interface';
import { IPasswordResetRepository } from 'src/repositories/password-reset/password-reset.repository.interface';

import { User } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserToken } from 'src/entities/user-token.entity';
import { Repository } from 'typeorm/repository/Repository';

import { ApiResponse } from 'libs/shared/ATVSLD/common/api-response';

import { ForgotPasswordRequest } from 'libs/shared/ATVSLD/models/requests/auth/forgot-password.request';
import { ResetPasswordRequest } from 'libs/shared/ATVSLD/models/requests/auth/reset-password.request';
import {
  ERROR_INACTIVE_ACCOUNT,
  ERROR_INVALID_ACCOUNT,
  ERROR_INVALID_TOKEN,
  ERROR_REFRESH_TOKEN_REQUIRED,
  // SUCCESS_LOGOUT,
} from 'libs/shared/ATVSLD/constants/auth-message.constant';
import {
  EMAIL_RESET_PASSWORD_SUCCESS,
  ERROR_EMAIL_NOT_FOUND,
  SUCCESS_FORGOT_PASSWORD,
} from 'libs/shared/ATVSLD/constants/mail.constant';
import { IPermissionRepository } from 'src/repositories/permission/permission.repository.interface';
import { JwtPayload } from 'libs/shared/ATVSLD/models/requests/auth/jwt-payload';
import { mapPermissionsToBooleanObject, PermissionConstant, PermissionMap } from 'libs/shared/ATVSLD/common/permission';
import { UserTypeEnum } from 'libs/shared/ATVSLD/enums/user-type.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserToken)
    private readonly tokenRepo: Repository<UserToken>,

    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,

    @Inject('IPasswordResetRepository')
    private readonly passwordResetRepository: IPasswordResetRepository,

    @Inject('IPermissionRepository')
    private readonly permissionRepo: IPermissionRepository,

    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  //  validate login
  async validateUser(account: string, password: string): Promise<User> {
    const user = await this.userRepo.findByAccount(account);
    if (!user) {
      throw new HttpException(ApiResponse.fail(HttpStatus.OK, ERROR_INVALID_ACCOUNT), HttpStatus.OK);
    }

    if (!user.isActive) {
      throw new HttpException(ApiResponse.fail(HttpStatus.OK, ERROR_INACTIVE_ACCOUNT), HttpStatus.OK);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new HttpException(ApiResponse.fail(HttpStatus.OK, ERROR_INVALID_ACCOUNT), HttpStatus.OK);
    }

    return user;
  }

  //  login trả access + refresh token
  async login(account: string, password: string) {
    const user = await this.validateUser(account, password);
    let permissionMap: PermissionMap;

    if (user.username === 'superadmin') {
      // Gán toàn bộ quyền là true
      const fullPermissionCodes = Object.fromEntries(
        Object.entries(PermissionConstant).map(([groupKey, group]) => [
          groupKey,
          Object.fromEntries(Object.keys(group).map((actionKey) => [actionKey, true])),
        ]),
      ) as PermissionMap;

      permissionMap = fullPermissionCodes;
    } else {
      const userPermissions = await this.permissionRepo.getPermissionCodesByUserId(user.id);
      permissionMap = mapPermissionsToBooleanObject(userPermissions);
    }
    const payload: JwtPayload = {
      id: user.id,
      userType: user.userType,
      businessId: user.businessId,
    };

    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.get('jwt.secret'),
      expiresIn: this.configService.get('jwt.accessExpiresIn'),
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get('jwt.refreshSecret'),
      expiresIn: this.configService.get('jwt.refreshExpiresIn'),
    });
    const refreshExpiresMs = ms(this.configService.get('jwt.refreshExpiresIn') || '7d');
    await this.tokenRepo.save({
      user,
      refresh_token,
      expires_at: new Date(Date.now() + refreshExpiresMs),
    });

    return {
      access_token,
      refresh_token,
      userAuthenticated: {
        id: user.id,
        full_name: user.fullName,
        user_type: user.userType,
        avatar: user.avatar,
        permissions: user.userType === UserTypeEnum.ADMIN ? permissionMap : undefined,
      },
    } as AuthResponse;
  }

  //  gửi email khôi phục mật khẩu
  async sendForgotPasswordEmail(dto: ForgotPasswordRequest): Promise<ApiResponse<{ token: string }>> {
    const user = await this.userRepo.findByEmail(dto.email);

    if (!user) {
      return ApiResponse.fail(HttpStatus.OK, ERROR_EMAIL_NOT_FOUND);
    }

    // 1. Tạo token ngẫu nhiên an toàn
    const token = randomBytes(32).toString('hex');

    // 2. Thời hạn token: 15 phút
    const expiresAt = new Date(Date.now() + ms('15m'));

    // 3. Lưu vào bảng password_resets
    await this.passwordResetRepository.createAndSave(user.id, token, expiresAt);

    // 4. Tạo link reset
    const clientResetUrl = `${this.configService.get('frontend.resetPasswordUrl')}?token=${token}`;

    // 5. Gửi email
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Đặt lại mật khẩu - ATVSLĐ',
      html: `
      <p>Xin chào ${user.fullName},</p>
      <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu của bạn.</p>
      <p>Vui lòng nhấn vào liên kết bên dưới để đặt lại mật khẩu (có hiệu lực trong 15 phút):</p>
      <p><a href="${clientResetUrl}">${clientResetUrl}</a></p>
      <p>Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>
    `,
    });

    return ApiResponse.success(HttpStatus.OK, SUCCESS_FORGOT_PASSWORD, {
      token: token,
    });
  }

  async resetPassword(dto: ResetPasswordRequest): Promise<ApiResponse<{ newPassword: string }>> {
    const record = await this.passwordResetRepository.findByToken(dto.token);

    if (!record || record.expires_at < new Date()) {
      return ApiResponse.fail(HttpStatus.OK, ERROR_INVALID_TOKEN);
    }

    const user = await this.userRepo.findById(record.user_id);
    if (!user) {
      return ApiResponse.fail(HttpStatus.OK, ERROR_INVALID_ACCOUNT);
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    user.password = hashedPassword;

    await this.userRepo.save(user); // cập nhật mật khẩu
    await this.passwordResetRepository.deleteByToken(dto.token); // xóa token sau khi dùng

    return ApiResponse.success(HttpStatus.OK, EMAIL_RESET_PASSWORD_SUCCESS, {
      newPassword: dto.newPassword,
    });
  }

  //  refresh token
  async refreshAccessToken(refresh_token: string) {
    if (!refresh_token) {
      throw new HttpException(
        ApiResponse.fail(HttpStatus.UNAUTHORIZED, ERROR_REFRESH_TOKEN_REQUIRED),
        HttpStatus.UNAUTHORIZED,
      );
    }

    const savedToken = await this.tokenRepo.findOne({
      where: { refresh_token },
      relations: ['user'],
    });

    if (!savedToken) {
      throw new HttpException(ApiResponse.fail(HttpStatus.UNAUTHORIZED, ERROR_INVALID_TOKEN), HttpStatus.UNAUTHORIZED);
    }

    let payload: AuthResponse;
    try {
      const decoded = this.jwtService.verify(refresh_token, {
        secret: this.configService.get('jwt.refreshSecret'),
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { exp, iat, ...rest } = decoded;
      payload = rest;
    } catch (err) {
      throw new HttpException(ApiResponse.fail(HttpStatus.UNAUTHORIZED, ERROR_INVALID_TOKEN), HttpStatus.UNAUTHORIZED);
    }

    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.get('jwt.secret'),
      expiresIn: this.configService.get('jwt.accessExpiresIn'),
    });

    return access_token;
  }

  async logout(refresh_token: string) {
    await this.tokenRepo.delete({ refresh_token });
  }
}
