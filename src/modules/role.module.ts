import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/entities/role.entity';
import { RolePermission } from 'src/entities/role-permission.entity';
import { RoleService } from 'src/services/role/role.service';
import { RoleRepository } from 'src/repositories/role/role.repository';
import { IRoleRepository } from 'src/repositories/role/role.repository.interface';
import { RoleController } from 'src/controllers/role.controller';
import { IPermissionRepository } from 'src/repositories/permission/permission.repository.interface';
import { PermissionRepository } from 'src/repositories/permission/permission.repository';
import { Permission } from 'src/entities/permission.entity';
import { User } from 'src/entities/user.entity';
import { IUserRepository } from 'src/repositories/user/user.repository.interface';
import { UserRepository } from 'src/repositories/user/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Role, RolePermission, Permission, User])],
  providers: [
    RoleService,
    {
      provide: IRoleRepository,
      useClass: RoleRepository,
    },
    {
      provide: IPermissionRepository,
      useClass: PermissionRepository,
    },
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
  ],
  controllers: [RoleController],
})
export class RoleModule {}
