import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
// import { v4 as uuid } from 'uuid';
import ms from 'ms';
import { generateRandomPassword } from 'libs/shared/ATVSLD/utils/helper.util';
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
  EMAIL_NEW_PASSWORD_SENT,
  EMAIL_RESET_PASSWORD_SUCCESS,
  ERROR_EMAIL_NOT_FOUND,
} from 'libs/shared/ATVSLD/constants/mail.constant';
import { IPermissionRepository } from 'src/repositories/permission/permission.repository.interface';
import { JwtPayload } from 'libs/shared/ATVSLD/models/requests/auth/jwt-payload';
import { mapPermissionsToBooleanObject } from 'libs/shared/ATVSLD/common/permission';
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
    const userPermissions = await this.permissionRepo.getPermissionCodesByUserId(user.id);
    const permissionMap = mapPermissionsToBooleanObject(userPermissions);
    const payload: JwtPayload = {
      id: user.id,
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
  async sendForgotPasswordEmail(dto: ForgotPasswordRequest): Promise<ApiResponse<null>> {
    const user = await this.userRepo.findByEmail(dto.email);

    if (!user) {
      return ApiResponse.fail(HttpStatus.NOT_FOUND, ERROR_EMAIL_NOT_FOUND);
    }

    //  Tạo password mới ngẫu nhiên
    const newPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật vào DB
    user.password = hashedPassword;
    await this.userRepo.save(user);

    const frontendUrl = this.configService.get<string>('frontend.url');
    //  Gửi email chứa mật khẩu mới
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Mật khẩu mới',
      text: `Mật khẩu mới của bạn là: ${newPassword}\n Nhấn vào link sau: ${frontendUrl}.`,
    });

    return ApiResponse.success(HttpStatus.OK, EMAIL_NEW_PASSWORD_SENT, null);

    // const token = uuid();
    // const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 phút

    // await this.passwordResetRepository.createAndSave(user.id, token, expiresAt);

    // const frontendUrl = this.configService.get<string>('frontend.url');
    // const resetLink = `${frontendUrl}/reset-password?token=${token}`;

    // await this.mailerService.sendMail({
    //   to: user.email,
    //   subject: 'Khôi phục mật khẩu',
    //   text: `Bạn đã yêu cầu khôi phục mật khẩu. Nhấn vào link sau: ${resetLink}`,
    // });

    // return ApiResponse.success(HttpStatus.OK, 'Email khôi phục đã được gửi', null);
  }

  async resetPassword(dto: ResetPasswordRequest): Promise<ApiResponse<null>> {
    const record = await this.passwordResetRepository.findByToken(dto.token);

    if (!record || record.expires_at < new Date()) {
      return ApiResponse.fail(HttpStatus.BAD_REQUEST, ERROR_INVALID_TOKEN);
    }

    const user = await this.userRepo.findById(record.user_id);
    if (!user) {
      return ApiResponse.fail(HttpStatus.BAD_REQUEST, ERROR_INVALID_ACCOUNT);
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    user.password = hashedPassword;

    await this.userRepo.save(user); // cập nhật mật khẩu
    await this.passwordResetRepository.deleteByToken(dto.token); // xóa token sau khi dùng

    return ApiResponse.success(HttpStatus.OK, EMAIL_RESET_PASSWORD_SUCCESS, null);
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
      throw new HttpException(
        ApiResponse.fail(HttpStatus.UNAUTHORIZED, 'ERROR_INVALID_TOKEN'),
        HttpStatus.UNAUTHORIZED,
      );
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
