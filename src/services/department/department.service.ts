import { Inject, Injectable } from '@nestjs/common';
import { IDepartmentRepository } from 'src/repositories/department/department.repository.interface';
import { IDepartmentService } from './department.service.interface';
import { DepartmentResponse } from 'libs/shared/ATVSLD/models/response/department/department.response';


@Injectable()
export class DepartmentService implements IDepartmentService {
  constructor(
    @Inject(IDepartmentRepository)
    private readonly deptRepo: IDepartmentRepository,
  ) {}

  async findForLogin(): Promise<{ id: number; name: string }[]> {
    return this.deptRepo.findForLogin();
  }

  async findAll(): Promise<DepartmentResponse[]> {
    return this.deptRepo.findAll()
  }
}
