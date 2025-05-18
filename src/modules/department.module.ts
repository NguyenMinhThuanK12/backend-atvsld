import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from 'src/entities/department.entity';
import { DepartmentController } from 'src/controllers/department.controller';
import { IDepartmentRepository} from 'src/repositories/department/department.repository.interface';
import { DepartmentService } from 'src/services/department/department.service';
import { DepartmentRepository } from 'src/repositories/department/department.respository';

@Module({
  imports: [TypeOrmModule.forFeature([Department])],
  controllers: [DepartmentController],
  providers: [
    DepartmentService,
    {
      provide: IDepartmentRepository,
      useClass: DepartmentRepository,
    },
  ],
  exports: [DepartmentService],
})
export class DepartmentModule {}
