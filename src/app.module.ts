import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import configuration from './configurations/configuration';
import { APP_GUARD } from '@nestjs/core';
import { PermissionsGuard } from 'libs/core/auth/permissions.guard';

import { UserModule } from './modules/user.module';
import { BusinessModule } from './modules/business.module';
import { PermissionModule } from './modules/permission.module';
import { RoleModule } from './modules/role.module';
import { AuthModule } from './modules/auth.module';
import { PdfModule } from './modules/pdf.module';
import { CloudinaryService } from 'libs/core/cloudinary/cloudinary.service';
import { SupabaseModule } from 'libs/core/supabase/supabase.module';
import { JwtAuthGuard } from 'libs/core/auth/jwt-auth.guard';
import { ReportConfigurationModule } from './modules/report-configuration.module';
import { ReportInstanceModule } from './modules/report-instance.module';
import { ReportDetailModule } from './modules/report-detail.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ReportConfigCronService } from './cron/report-config-cron.service';
@Module({
  imports: [
    ScheduleModule.forRoot(),
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
    PdfModule,
    SupabaseModule,
    AuthModule,
    UserModule,
    BusinessModule,
    PermissionModule,
    RoleModule,
    ReportConfigurationModule,
    ReportInstanceModule,
    ReportDetailModule,
  ],
  controllers: [],
  providers: [
    CloudinaryService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    ReportConfigCronService,
  ],
  exports: [CloudinaryService],
})
export class AppModule {}
