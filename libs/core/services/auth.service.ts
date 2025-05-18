import { HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { AuthResponse } from 'libs/shared/ATVSLD/models/response/auth/auth.response';
import { IUserRepository } from 'src/repositories/user/user.repository.interface';
import { User } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserToken } from 'src/entities/user-token.entity';
import { Repository } from 'typeorm/repository/Repository';
import { ApiResponse } from 'libs/shared/ATVSLD/common/api-response';
import { ERROR_INACTIVE_ACCOUNT, ERROR_INVALID_TOKEN, ERROR_REFRESH_TOKEN_REQUIRED, ERROR_USER_NOT_IN_DEPARTMENT } from 'libs/shared/ATVSLD/constants/error-message.constant';
import { UserAuthenticatedResponse } from 'libs/shared/ATVSLD/models/response/user/userAuthenticated';
import { SUCCESS_LOGOUT, SUCCESS_REFRESH_TOKEN } from 'libs/shared/ATVSLD/constants/success-message.constant';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserToken)
    private readonly tokenRepo: Repository<UserToken>,

    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,

    private readonly jwtService: JwtService,

    private readonly configService: ConfigService,
  ) {}

  async validateUser(
    account: string,
    password: string,
    department_id: number,
  ): Promise<User> {
    const user = await this.userRepo.findByAccountAndDepartment(
      account,
      department_id,
    );

    if (!user) {
      throw new HttpException(
        ApiResponse.fail(HttpStatus.UNAUTHORIZED, ERROR_USER_NOT_IN_DEPARTMENT),
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (!user.is_active) {
      throw new HttpException(
        ApiResponse.fail(HttpStatus.UNAUTHORIZED, ERROR_INACTIVE_ACCOUNT),
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new HttpException(
        ApiResponse.fail(HttpStatus.UNAUTHORIZED, ERROR_INACTIVE_ACCOUNT),
        HttpStatus.UNAUTHORIZED,
      );
    }

    return user;
  }

  async login(user: User) {
    const payload: UserAuthenticatedResponse = {
      id: user.id,
      account: user.account,
      full_name: user.full_name,
      department_id: user.department?.id ?? user.department_id,
      role_code: user.role?.code ?? '',
    };

    const access_token = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET') || 'refresh123',
      expiresIn: '7d',
    });

    await this.tokenRepo.save({
      user,
      refresh_token,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return {
      access_token,
      refresh_token,
      userAuthenticated: {
        id: user.id,
        full_name: user.full_name,
        account: user.account,
        role_code: payload.role_code, 
        department_id: payload.department_id,
      },
    } as AuthResponse; 
  }

  async refreshAccessToken(refresh_token: string) {
    if (!refresh_token) {
      throw new HttpException(
        ApiResponse.fail(
          HttpStatus.UNAUTHORIZED,
          ERROR_REFRESH_TOKEN_REQUIRED,
        ),
        HttpStatus.UNAUTHORIZED,
      );
    }

    const savedToken = await this.tokenRepo.findOne({
      where: { refresh_token },
      relations: ['user'],
    });

    if (!savedToken) {
      throw new HttpException(
        ApiResponse.fail(HttpStatus.UNAUTHORIZED, ERROR_INVALID_TOKEN),
        HttpStatus.UNAUTHORIZED,
      );
    }

    let payload: AuthResponse;
    try {
      const decoded = this.jwtService.verify(refresh_token, {
        secret: this.configService.get('JWT_REFRESH_SECRET') || 'refresh123',
      });

      const { exp, iat, ...rest } = decoded;
      payload = rest;
    } catch (err) {
      throw new HttpException(
        ApiResponse.fail(
          HttpStatus.UNAUTHORIZED,
          ERROR_INVALID_TOKEN,
        ),
        HttpStatus.UNAUTHORIZED,
      );
    }

    const access_token = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    return ApiResponse.success(
      HttpStatus.OK,
      SUCCESS_REFRESH_TOKEN,
      { access_token },
    );
  }
  async logout(refresh_token: string) {
    await this.tokenRepo.delete({ refresh_token });
    return {SUCCESS_LOGOUT}; 
  }
}
