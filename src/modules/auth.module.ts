import { Module } from '@nestjs/common';
import { AuthService } from 'libs/core/services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'libs/core/auth/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from 'src/controllers';
import { User } from 'src/entities/user.entity';
import { Role } from 'src/entities/role.entity';
import { UserModule } from './user.module';
import { UserToken } from 'src/entities/user-token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, UserToken]),
    UserModule,
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
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}