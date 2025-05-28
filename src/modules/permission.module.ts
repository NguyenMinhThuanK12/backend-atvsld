import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from 'src/entities/permission.entity';
import { PermissionService } from 'src/services/permission/permission.service';

import { PermissionRepository } from 'src/repositories/permission/permission.repository';
import { IPermissionRepository } from 'src/repositories/permission/permission.repository.interface';
import { PermissionController } from 'src/controllers/permission.contrller';
import { IUserRepository } from 'src/repositories/user/user.repository.interface';
import { UserRepository } from 'src/repositories/user/user.repository';
import { User } from 'src/entities/user.entity';
import { PermissionsGuard } from 'libs/core/auth/permissions.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Permission, User])],
  controllers: [PermissionController],
  providers: [
    PermissionService,
    {
      provide: IPermissionRepository,
      useClass: PermissionRepository,
    },
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
    PermissionsGuard,
  ],
  exports: [IPermissionRepository, PermissionsGuard],
})
export class PermissionModule {}
