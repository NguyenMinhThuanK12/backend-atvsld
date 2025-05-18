import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolePermission } from 'src/entities/role-permission.entity';
import { Role } from 'src/entities/role.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Role,RolePermission])],
//   controllers: [UserController],
//   providers: [UserService],
//   exports: [UserService],
})
export class RoleModule {}