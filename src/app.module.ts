import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import configuration from './configurations/configuration';

import { UserModule } from './modules/user.module';
import { DepartmentModule } from './modules/department.module';
import { PermissionModule } from './modules/permission.module';
import { RoleModule } from './modules/role.module';
import { AuthModule } from './modules/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', 
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        ...config.get('database'),
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          transport: {
            host: config.get('MAIL_HOST'),
            port: config.get<number>('MAIL_PORT'),
            secure: false,
            auth: {
              user: config.get('MAIL_USER'),
              pass: config.get('MAIL_PASS'),
            },
          },
          defaults: {
            from: '"ATVSLĐ System" <no-reply@atvsld.local>',
          },
        };
      },
    }),
    AuthModule,
    UserModule,
    DepartmentModule,
    PermissionModule,
    RoleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
