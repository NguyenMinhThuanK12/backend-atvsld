import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from 'src/entities/permission.entity';
import { PermissionService } from 'src/services/permission/permission.service';

import { PermissionRepository } from 'src/repositories/permission/permission.repository';
import { IPermissionRepository } from 'src/repositories/permission/permission.repository.interface';
import { PermissionController } from 'src/controllers/permission.contrller';

@Module({
  imports: [TypeOrmModule.forFeature([Permission])],
  controllers: [PermissionController],
  providers: [
    PermissionService,
    {
      provide: IPermissionRepository,
      useClass: PermissionRepository,
    },
  ],
})
export class PermissionModule {}
