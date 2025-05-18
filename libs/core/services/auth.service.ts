import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { AuthResponse } from 'libs/shared/ATVSLD/models/response/auth/auth.response';
import { IUserRepository } from 'src/repositories/user/user.repository.interface';
import { User } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserToken } from 'src/entities/user-token.entity';
import { Repository } from 'typeorm/repository/Repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserToken)
    private readonly tokenRepo: Repository<UserToken>,

    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,

    private readonly jwtService: JwtService,
    
    private readonly configService: ConfigService 
  ) {}

  async validateUser(account: string, password: string, department_id: number): Promise<User> {
    const user = await this.userRepo.findByAccountAndDepartment(account, department_id);

    if (!user) {
      throw new UnauthorizedException('Tài khoản không tồn tại trong đơn vị đã chọn');
    }

    if (!user.is_active) {
      throw new UnauthorizedException('Tài khoản đã bị khóa');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Sai mật khẩu');
    }

    return user;
  }

  async login(user: User) {
    const payload: AuthResponse = {
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
      user: {
        id: user.id,
        full_name: user.full_name,
        account: user.account,
        role: payload.role_code,
        department_id: payload.department_id,
      },
    };
  }

  async refreshAccessToken(refresh_token: string) {
    if (!refresh_token) {
      throw new UnauthorizedException('Refresh token không được để trống');
    }
  
    const savedToken = await this.tokenRepo.findOne({
      where: { refresh_token },
      relations: ['user'],
    });
  
    if (!savedToken) {
      throw new UnauthorizedException('Token không hợp lệ');
    }
  
    let payload: AuthResponse;
    try {
      const decoded = this.jwtService.verify(refresh_token, {
        secret: this.configService.get('JWT_REFRESH_SECRET') || 'refresh123',
      });
  
      const { exp, iat, ...rest } = decoded;
      payload = rest;
    } catch (err) {
      throw new UnauthorizedException('Token hết hạn hoặc không hợp lệ');
    }
  
    const access_token = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });
  
    return { access_token };
  }

  async logout(refresh_token: string) {
    await this.tokenRepo.delete({ refresh_token });
    return { message: 'Đăng xuất thành công' };
  }
}
