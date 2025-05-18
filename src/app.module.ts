import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configurations/configuration';
import { UserModule } from './modules/user.module';
import { DepartmentModule } from './modules/department.module';
import { PermissionModule } from './modules/permission.module';
import { RoleModule } from './modules/role.module';
import { AuthModule } from './modules/auth.module';
// import { UserModule, DepartmentModule, PermissionModule, RoleModule  } from './modules/';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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
    AuthModule,
    UserModule,
    DepartmentModule,
    PermissionModule,
    RoleModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
