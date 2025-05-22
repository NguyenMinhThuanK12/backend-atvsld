import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from 'src/entities/department.entity';
import { IDepartmentRepository } from './department.repository.interface';
import { DepartmentResponse } from 'libs/shared/ATVSLD/models/response/department/department.response';
import { CreateDepartmentRequest } from 'libs/shared/ATVSLD/models/requests/department/create-department.request';
import { mapToDepartmentResponse } from 'libs/shared/ATVSLD/mappers/department.mapper';

@Injectable()
export class DepartmentRepository implements IDepartmentRepository {
  constructor(
    @InjectRepository(Department)
    private readonly repo: Repository<Department>,
  ) {}

  async findPaginated(
    page: number,
    limit: number,
  ): Promise<[DepartmentResponse[], number]> {
    const [items, total] = await this.repo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    const data = items.map(mapToDepartmentResponse);
    return [data, total];
  }

  async isTaxCodeExisted(taxCode: string): Promise<boolean> {
    const result = await this.repo.findOne({
      where: { taxCode },
    });
    return !!result;
  }

  async isEmailExisted(email: string): Promise<boolean> {
    if (!email) return false;

    const result = await this.repo.findOne({
      where: { email },
    });
    return !!result;
  }

  async create(data: CreateDepartmentRequest): Promise<DepartmentResponse> {
    const entity = this.repo.create(data);
    const saved = await this.repo.save(entity);
    return mapToDepartmentResponse(saved);
  }
}
