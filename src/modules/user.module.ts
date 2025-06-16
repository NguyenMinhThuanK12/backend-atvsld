import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from 'src/controllers/user.controller';
import { Permission } from 'src/entities/permission.entity';
import { RolePermission } from 'src/entities/role-permission.entity';
import { Role } from 'src/entities/role.entity';
import { User } from 'src/entities/user.entity';
import { UserRepository } from 'src/repositories/user/user.repository';
import { IPermissionRepository } from 'src/repositories/permission/permission.repository.interface';
import { PermissionRepository } from 'src/repositories/permission/permission.repository';
import { RoleRepository } from 'src/repositories/role/role.repository';
import { IRoleRepository } from 'src/repositories/role/role.repository.interface';
import { UserService } from 'src/services/user/user.service';
import { BusinessRepository } from 'src/repositories/business/business.respository';
import { IBusinessRepository } from 'src/repositories/business/business.repository.interface';
import { IUserRepository } from 'src/repositories/user/user.repository.interface';
import { Business } from 'src/entities/business.entity';
import { SupabaseModule } from 'libs/core/supabase/supabase.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Permission, RolePermission, Business]), SupabaseModule],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
    {
      provide: IPermissionRepository,
      useClass: PermissionRepository,
    },
    {
      provide: IRoleRepository,
      useClass: RoleRepository,
    },
    {
      provide: IBusinessRepository,
      useClass: BusinessRepository,
    },
  ],
  // exports: ['IUserRepository'],
})
export class UserModule {}
