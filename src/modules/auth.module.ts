import { Module } from '@nestjs/common';
import { AuthService } from 'libs/core/services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'libs/core/auth/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from 'src/entities/user.entity';
import { Role } from 'src/entities/role.entity';
import { UserModule } from './user.module';
import { UserToken } from 'src/entities/user-token.entity';
import { PasswordReset } from 'src/entities/password-reset.entity';
import { UserRepository } from 'src/repositories/user/user.repository';
// import { PasswordResetRepository } from 'src/repositories/password-reset/password-reset.repository';
import { PasswordResetModule } from './password-reset.module';
import { AuthController } from 'src/controllers/auth.controller';
import { PermissionModule } from './permission.module';
import { RolePermission } from 'src/entities/role-permission.entity';
import { Permission } from 'src/entities/permission.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, UserToken, PasswordReset, Permission, RolePermission]),
    UserModule,
    PasswordResetModule,
    PermissionModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET') || 'secret123',
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
  ],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}
