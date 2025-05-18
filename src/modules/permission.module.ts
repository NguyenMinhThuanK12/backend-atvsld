import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from 'src/entities/permission.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Permission])],
//   controllers: [UserController],
//   providers: [UserService],
//   exports: [UserService],
})
export class PermissionModule {}

